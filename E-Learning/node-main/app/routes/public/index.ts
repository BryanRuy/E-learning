import express, { NextFunction, Request, Response } from "express";
import { AuthorizeUtil } from "../../../sequelize/middlewares/auth/auth";
import { RoleTypeRegex } from "../../../sequelize/types";
import * as UserCTRL from "../../controllers/users";
import { adminRoutes } from "./documents";
import * as LookupCTRL from "../../controllers/lookups";
import { PaymentCtrl } from "../../controllers/profile";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(
    `<h1 style="margin-top:25%; text-align:center">noName is live!</h1>`
  );
});

router.post("/register", UserCTRL.RegisterUser);
router.post(`/authenticate/:userType(${RoleTypeRegex})`, UserCTRL.LoginUser);
router.post(
  `/authenticate-with-google/:userType(${RoleTypeRegex})`,
  UserCTRL.GoogleLoginUser
);
router.post(
  `/setup-password`,
  AuthorizeUtil.AuthorizeUser,
  UserCTRL.SetupPassword
);
router.post(`/forget-password`, UserCTRL.forgetPassword);
router.post(`/reset-password`, UserCTRL.ResetPassword);
router.use("/documents", adminRoutes);

router.get("/counties", LookupCTRL.GetCounties);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentCtrl.StripeWebhookEvent
);
export default router;
