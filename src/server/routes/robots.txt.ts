export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return ['User-agent: *', 'Allow: /', 'Sitemap: /sitemap.xml'].join('\n');
});
