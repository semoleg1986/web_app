import { defineEventHandler } from "h3";

import { proxyRegister } from "~/server/utils/auth-proxy";

export default defineEventHandler(async (event) => {
  return await proxyRegister(event);
});
