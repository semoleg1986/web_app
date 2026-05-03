import { defineEventHandler } from "h3";

import { proxyLogin } from "~/server/utils/auth-proxy";

export default defineEventHandler(async (event) => {
  return await proxyLogin(event);
});
