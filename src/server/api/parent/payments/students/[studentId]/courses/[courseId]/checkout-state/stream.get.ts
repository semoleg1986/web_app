import { createEventStream, fetchWithEvent } from "h3";

export default defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, "studentId");
  const courseId = getRouterParam(event, "courseId");

  if (!studentId || !courseId) {
    throw createError({ statusCode: 400, statusMessage: "Missing route params" });
  }

  const eventStream = createEventStream(event);
  let disposed = false;
  let lastSnapshot = "";

  const fetchSnapshot = async () => {
    const snapshot = await fetchWithEvent(
      event,
      `/api/parent/payments/students/${studentId}/courses/${courseId}/checkout-state`
    );

    return JSON.stringify(snapshot);
  };

  const tick = async () => {
    if (disposed) {
      return;
    }

    try {
      const nextSnapshot = await fetchSnapshot();
      if (nextSnapshot !== lastSnapshot) {
        lastSnapshot = nextSnapshot;
        await eventStream.push({ event: "update", data: nextSnapshot });
      }
    } catch (error) {
      if (!disposed) {
        await eventStream.push({
          event: "error",
          data: JSON.stringify({
            message: error instanceof Error ? error.message : "SSE snapshot failed"
          })
        });
      }
    }
  };

  const interval = setInterval(() => {
    void tick();
  }, 5000);

  eventStream.onClosed(async () => {
    disposed = true;
    clearInterval(interval);
    await eventStream.close();
  });

  const response = eventStream.send();
  void tick();
  return response;
});
