import { api } from "../helpers/request.js";

describe("auth routes", () => {
  it("validates register payload", async () => {
    const res = await api.post("/v1/auth/register").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("validates login payload", async () => {
    const res = await api.post("/v1/auth/login").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("validates forgot password payload", async () => {
    const res = await api.post("/v1/auth/forgot-password").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("validates reset password payload", async () => {
    const res = await api.post("/v1/auth/reset-password/test-token").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects refresh without refresh token cookie", async () => {
    const res = await api.post("/v1/auth/refresh-token").send({});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
