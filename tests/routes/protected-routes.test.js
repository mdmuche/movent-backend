import { api } from "../helpers/request.js";

const protectedRoutes = [
  ["GET", "/v1/user/profile"],
  ["GET", "/v1/user/dashboard"],
  ["POST", "/v1/user/saved-events/64f000000000000000000001"],
  ["GET", "/v1/user/saved-events"],
  ["GET", "/v1/user/activity"],
  ["PATCH", "/v1/user/profile"],
  ["PATCH", "/v1/user/profile/picture"],
  ["PATCH", "/v1/user/notification/preferences"],
  ["PATCH", "/v1/user/language/preference"],
  ["DELETE", "/v1/user/account"],
  ["DELETE", "/v1/user/saved-events/64f000000000000000000001"],
  ["GET", "/v1/ticket/my-tickets"],
  ["POST", "/v1/ticket/purchase"],
  ["GET", "/v1/organizer/analytics"],
  ["GET", "/v1/organizer/events/64f000000000000000000001/stats"],
  ["GET", "/v1/organizer/my-events"],
  ["POST", "/v1/organizer/events"],
  ["PUT", "/v1/organizer/events/64f000000000000000000001"],
  ["DELETE", "/v1/organizer/events/64f000000000000000000001"],
  ["GET", "/v1/event/recommendations"],
  ["GET", "/v1/event/upcoming"],
  ["POST", "/v1/checkout/initiate"],
  ["GET", "/v1/checkout/verify/test-reference"],
  ["POST", "/v1/checkout/promo/apply"],
  ["POST", "/v1/checkout/refund/64f000000000000000000001"],
  ["GET", "/v1/checkout/history"],
  ["GET", "/v1/checkout/test-reference"],
  ["PATCH", "/v1/checkout/cancel/test-reference"],
  ["POST", "/v1/checkout/resend-ticket/64f000000000000000000001"],
  ["POST", "/v1/checkout/validate-ticket/64f000000000000000000001"],
  ["POST", "/v1/notification"],
  ["GET", "/v1/notification"],
  ["GET", "/v1/notification/unread-count"],
  ["PATCH", "/v1/notification/64f000000000000000000001/read"],
  ["PATCH", "/v1/notification/mark-all-read"],
  ["DELETE", "/v1/notification/64f000000000000000000001"],
  ["GET", "/v1/admin/overview"],
  ["GET", "/v1/admin/event-queue"],
  ["GET", "/v1/admin"],
  ["GET", "/v1/admin/settings"],
  ["GET", "/v1/admin/audit-logs"],
  ["GET", "/v1/admin/reports/export"],
  ["PATCH", "/v1/admin/users/64f000000000000000000001/make-organizer"],
  ["PATCH", "/v1/admin/users/64f000000000000000000001/flag"],
  ["PATCH", "/v1/admin/users/64f000000000000000000001/suspend"],
  ["PATCH", "/v1/admin/settings"],
  ["GET", "/v1/newsletter/subscribers"],
];

describe("protected routes", () => {
  it.each(protectedRoutes)(
    "%s %s rejects missing auth",
    async (method, url) => {
      const res = await api[method.toLowerCase()](url);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    },
  );
});
