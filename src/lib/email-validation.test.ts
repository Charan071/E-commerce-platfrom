import { describe, expect, it } from "vitest";
import { isValidEmail } from "@/lib/email-validation";

describe("isValidEmail", () => {
  it("accepts typical addresses", () => {
    expect(isValidEmail("hello@example.com")).toBe(true);
    expect(isValidEmail("  User@Domain.co.uk  ")).toBe(true);
  });

  it("rejects invalid input", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
  });

  it("rejects overly long local part", () => {
    const long = `${"a".repeat(250)}@x.com`;
    expect(isValidEmail(long)).toBe(false);
  });
});
