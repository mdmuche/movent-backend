import { api } from "../helpers/request.js";

describe("public routes", () => {
  it("returns the API welcome message", async () => {
    const res = await api.get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Welcome to Movent API!");
  });

  it("returns structured 404 responses", async () => {
    const res = await api.get("/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("validates newsletter subscribe payload", async () => {
    const res = await api.post("/v1/newsletter/subscribe").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("validates newsletter unsubscribe payload", async () => {
    const res = await api.post("/v1/newsletter/unsubscribe").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("validates public event query params", async () => {
    const res = await api.get("/v1/event").query({ page: 0 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("allows mobile-style event preflight headers from the production origin", async () => {
    const res = await api
      .options("/v1/event?status=upcoming&limit=3&sort=latest")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "GET")
      .set(
        "Access-Control-Request-Headers",
        "cache-control,pragma,x-requested-with",
      );

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000",
    );
    expect(res.headers["access-control-allow-headers"]).toContain(
      "Cache-Control",
    );
    expect(res.headers["access-control-allow-headers"]).toContain("Pragma");
    expect(res.headers["access-control-allow-headers"]).toContain(
      "X-Requested-With",
    );
  });

  it("does not turn disallowed CORS origins into server errors", async () => {
    const res = await api
      .options("/v1/event?status=upcoming&limit=3&sort=latest")
      .set("Origin", "https://example.com")
      .set("Access-Control-Request-Method", "GET");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
