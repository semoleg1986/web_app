export default defineEventHandler(() => {
  return {
    ok: true,
    service: "web_app",
    timestamp: new Date().toISOString()
  };
});
