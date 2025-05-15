import { Authcontroller } from "@/controller/auth.controller";
import { AuthServices } from "@/services/implementation/AuthServices.services";
import { Router } from "express";
import { validate } from "@/middleware/validate.middleware";
import { signUpSchema } from "@/schema/signup.schema";
import { signIn } from "@/schema/sigin.schema";
import varifyTocken from "@/middleware/varify-tocken";
const router = Router();
const authServices = new AuthServices();
const authcontrller = new Authcontroller(authServices);
router.post(
  "/",
  validate(signUpSchema),
  authcontrller.signUp.bind(authcontrller)
);
router.post(
  "/login",
  validate(signIn),
  // varifyTocken('user'),
  authcontrller.signIn.bind(authcontrller)
);
export default router;
