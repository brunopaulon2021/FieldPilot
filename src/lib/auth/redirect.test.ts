import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/auth/redirect";

describe("safeRedirectPath", () => {
  it("keeps local paths and query strings", () => {
    expect(safeRedirectPath("/app?view=today", "/app")).toBe("/app?view=today");
  });

  it.each(["https://evil.example", "//evil.example/path", "javascript:alert(1)", "app"])(
    "rejects an unsafe redirect: %s",
    (value) => expect(safeRedirectPath(value, "/app")).toBe("/app"),
  );
});
