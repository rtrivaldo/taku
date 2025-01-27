import { z } from "zod";

export const fullNameSchema = z.string().min(2, {
  message: "Full name must be at least 2 characters.",
});

export const emailSchema = z.string().email({
  message: "Please provide a valid email address.",
});

export const passwordSchema = z
  .string()
  .min(12, { message: "Password must be at least 12 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number.",
  })
  .regex(/[@$!%*?&#]/, {
    message:
      "Password must contain at least one special character (@, $, !, %, *, ?, &, #).",
  });
