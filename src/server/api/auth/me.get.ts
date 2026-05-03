import { defineEventHandler } from "h3";

import { proxyMe } from "~/server/utils/auth-proxy";

export default defineEventHandler(async (event) => {
  return await proxyMe(event);
});
