import { defineEventHandler } from "h3";

import { proxyLogout } from "~/server/utils/auth-proxy";

export default defineEventHandler(async (event) => {
  return await proxyLogout(event);
});
