import { defineEventHandler } from "h3";

import { proxyAcceptInvite } from "~/server/utils/auth-proxy";

export default defineEventHandler(async (event) => {
  return await proxyAcceptInvite(event);
});
