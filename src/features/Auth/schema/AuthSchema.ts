import { z } from "zod";

export const userSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

export type IUserInput = z.infer<typeof userSchema>;
