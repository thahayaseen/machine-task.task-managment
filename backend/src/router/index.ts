import { Router } from "express";
const router = Router();
import AuthRouter from "@/router/auth.route";
import { validate } from "@/middleware/validate.middleware";
import { siginSchema } from "@/schema/signin.schema";
router.use("/auth", validate(siginSchema), AuthRouter);
export default router;
