import { test } from "node:test";
import assert from "node:assert/strict";
import { createUserSchema } from "../src/admin/validations/user.schema.ts";

const data = {
  firstName: "Ana",
  lastName: "",
  email: "ana@example.com",
  role: "ADMIN",
  isActive: true,
  password: "",
  confirmPassword: "",
  currentPassword: "",
};
const create = createUserSchema({
  isEdit: false,
  isAccount: false,
  originalEmail: "",
});
const edit = createUserSchema({
  isEdit: true,
  isAccount: false,
  originalEmail: data.email,
});
const account = createUserSchema({
  isEdit: true,
  isAccount: true,
  originalEmail: data.email,
});

test("requires a password on creation but preserves it when an edit leaves it blank", () => {
  assert.equal(create.safeParse(data).success, false);
  assert.equal(edit.safeParse(data).success, true);
});
test("rejects mismatched confirmation and passwords that bcrypt would truncate", () => {
  assert.equal(
    create.safeParse({
      ...data,
      password: "Password123!",
      confirmPassword: "Other123!",
    }).success,
    false,
  );
  assert.equal(
    create.safeParse({
      ...data,
      password: "é".repeat(40),
      confirmPassword: "é".repeat(40),
    }).success,
    false,
  );
});
test("keeps password whitespace while normalizing names and email", () => {
  const result = create.parse({
    ...data,
    firstName: " Ana ",
    email: " ANA@EXAMPLE.COM ",
    password: " Password123! ",
    confirmPassword: " Password123! ",
  });
  assert.equal(result.firstName, "Ana");
  assert.equal(result.email, "ana@example.com");
  assert.equal(result.password, " Password123! ");
});
test("requires the current password for credential changes but not profile names", () => {
  assert.equal(
    account.safeParse({ ...data, firstName: "Maria" }).success,
    true,
  );
  assert.equal(
    account.safeParse({ ...data, email: "new@example.com" }).success,
    false,
  );
  assert.equal(
    account.safeParse({
      ...data,
      email: "new@example.com",
      currentPassword: "OldPassword",
    }).success,
    true,
  );
  assert.equal(
    account.safeParse({
      ...data,
      password: "Password123!",
      confirmPassword: "Password123!",
    }).success,
    false,
  );
});
test("rejects unknown access roles", () => {
  assert.equal(edit.safeParse({ ...data, role: "OWNER" }).success, false);
});
