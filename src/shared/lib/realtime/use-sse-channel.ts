export function useSseChannel(
  url: MaybeRefOrGetter<string>,
  handlers: {
    onMessage?: (payload: string) => void;
    onError?: () => void;
  } = {}
) {
  let source: EventSource | null = null;

  function close() {
    if (source) {
      source.close();
      source = null;
    }
  }

  function open(nextUrl: string) {
    close();
    if (!import.meta.client || !nextUrl) {
      return;
    }

    source = new EventSource(nextUrl, { withCredentials: true });
    source.onmessage = (event) => {
      handlers.onMessage?.(event.data);
    };
    source.onerror = () => {
      handlers.onError?.();
    };
  }

  if (import.meta.client) {
    watch(
      () => toValue(url),
      (nextUrl) => {
        open(nextUrl);
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      close();
    });
  }

  return { close };
}
