import { z } from "zod";
import { HttpResponse } from "@/constants";
export const siginSchema = z.object({
  email: z.string({required_error:'email required_erro'}).email(HttpResponse.INVALID_EMAIL),
  password: z
    .string()
    .min(8, "password must be greater than 8 letters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  username: z.string(),
});
