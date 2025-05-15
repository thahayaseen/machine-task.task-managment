import { Router } from "express";
const router = Router();
import AuthRouter from "@/router/auth.route";
import { validate } from "@/middleware/validate.middleware";
router.use("/auth", AuthRouter);
export default router;
