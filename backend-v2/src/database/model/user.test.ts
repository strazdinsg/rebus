import { beforeAll, describe, expect, it } from "vitest";
import { User } from "./user";

describe("User model", () => {
  beforeAll(async () => {
    await User.sync();
  });

  it("PIN must be at least 4 characters long", async () => {
    await expect(createUserWithPin("123")).rejects.toThrow();
    await expect(createUserWithPin("")).rejects.toThrow();
  });

  it("PIN must be no more than 6 characters long", async () => {
    await expect(createUserWithPin("1234567")).rejects.toThrow();
  });

  it("PIN OK", async () => {
    let user: User = await createUserWithPin("1234");
    expect(user.pin).toBe("1234");
    user = await createUserWithPin("123456");
    expect(user.pin).toBe("123456");
  });

  it("Name must be unique", async () => {
    let user: User = await createUserWithPin("9999");
    expect(user.pin).toBe("9999");
    await expect(createUserWithPin("9999")).rejects.toThrow();
  });

  async function createUserWithPin(pin: string): Promise<User> {
    return User.create({
      name: `User ${pin}`,
      pin: pin,
    });
  }
});
