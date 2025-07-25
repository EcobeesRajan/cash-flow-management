import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().min(4, "Email is required").email("Invalid email"),

  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginErrors = Partial<Record<keyof LoginInput, string>>;
