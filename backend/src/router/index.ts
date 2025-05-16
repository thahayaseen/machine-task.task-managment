import { Router } from "express";
const router = Router();
import AuthRouter from "@/router/auth.route";
import { validate } from "@/middleware/validate.middleware";
import RestauratnRotuer from '@/router/resturet.route'
router.use("/auth", AuthRouter);
router.use('/restaurant',RestauratnRotuer)
export default router;
