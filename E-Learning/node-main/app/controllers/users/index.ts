import { NextFunction, Request, Response } from "express";
import {
  DataResponse,
  LocaleDataResponse,
} from "../../../sequelize/utils/http-response";
import {
  UserAddSchema,
  UserAuthSchema,
  UserPasswordSchema,
} from "../../../sequelize/validation-schema";

import { UserFactory } from "../../services/user/user-factory";
import {
  RoleType,
  SequelizeAttributes,
  StudentStatusEnum,
  TeacherStatusEnum,
  StudentStatus,
  TeacherStatus,
} from "../../../sequelize/types";
import { User } from "../../../sequelize";
import { TokenCore } from "../../../sequelize/middlewares/auth/token";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { ProfileUtil } from "../../services/user/profile";
import { UserCore } from "../../services/user/user-core";
import { GoogleCore } from "../../services/google";
import { ResetAuthCore } from "../../services/reset-auth";
import { generateEmailFormat } from "../../services/email/email-templates";
import { Email } from "../../services/email";
import moment from "moment";
import { GetStripeAccount } from "../../services/payment/stripe-account";
import { PaymentPlansUtil } from "../../services/payment/payment-plans";
export * as DocumentCTRL from "./documents";

export async function RegisterAdminUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const superAdmin = req.CurrentUser;

    if (superAdmin?.roleId != "super-admin")
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    return await RegisterUser(req, res, next, true);
  } catch (err) {
    next(err);
  }
}

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction,
  isSuperAdmin: Boolean = false
) {
  try {
    const user = req.body;
    await UserAddSchema.validateAsync(user);
    user.roleId = user.role;

    if (user.roleId == "admin" && !isSuperAdmin)
      throw new BadRequestError(...a(`You are not allowed to create an admin`));

    // if (user.roleId == "student" || user.roleId == "teacher") {
    //   let checkReCaptcha = (await GoogleCore.verifyReCaptchaToken(
    //     user.reCaptchaToken
    //   )) as any;
    //   if (!checkReCaptcha.success) {
    //     throw new BadRequestError(
    //       ...a(`Recaptcha Error: ${checkReCaptcha["error-codes"]}`)
    //     );
    //   }
    // }

    let userCore = UserFactory(user.roleId);
    const newUser = await userCore.RegisterUser(user);

    const userSafe = await userCore.GetUserById({
      key: newUser._userId!,
    } as any);

    let token = await TokenCore.IssueEJWT(newUser);

    if (user.roleId == "student" && !userSafe?.student?.teacher?.teacherId)
      delete userSafe?.student?.teacher;

    if (
      user.roleId == "teacher" &&
      !Array.isArray(userSafe?.teacher?.students) &&
      !(userSafe?.teacher?.students as any).studentId
    )
      delete userSafe?.teacher?.students;

    if (user.roleId == "teacher" || user.roleId == "student") {
      let emailFormat = generateEmailFormat(
        "Welcome",
        `Bună, ${
          userSafe!.name
        }!, Îți mulțumim că te-ai alăturat comunității noastre și că vrei să faci parte din mișcarea noastră de a îmbunătăți serviciile de educație.
        Pasul următor este să verifici pașii din contul tău, să te obișnuiești cu platforma și să intri în grupul nostru de Facebook pentru a ajuta alți membri sau a fi ajutat, dacă întampini exerciții dificile.
        Am pregătit multe pentru tine, însă te așteptăm pe contul tău proaspăt configurat pe noName.ro`,
        "",
        {
          text: "Go to website",
          href: `https://${user.roleId}.noName.ro/`,
        }
      );

      let sentMail = await Email.getInstance("NoReply").sendEmail(
        userSafe!.name,
        "Welcome",
        emailFormat
      );
    }

    return DataResponse(res, 200, {
      user: userSafe,
      tokenType: "EJWT",
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    await UserAuthSchema.validateAsync(data);

    let userType: RoleType = req.params.userType as RoleType;
    if (userType == "admin" || userType == "super-admin") {
      let checkReCaptcha = (await GoogleCore.verifyReCaptchaToken(
        data.reCaptchaToken
      )) as any;
      if (!checkReCaptcha.success) {
        throw new BadRequestError(
          ...a(`Recaptcha Error: ${checkReCaptcha["error-codes"]}`)
        );
      }
    }
    let userCore = UserFactory(userType);
    const user = await userCore.LoginUser(data.email, data.password);

    const userSafe = (await userCore.GetUserById({
      key: user._userId!,
    } as any)) as any;

    let token = await TokenCore.IssueEJWT(user);

    if (userType == "student" && !userSafe?.student?.teacher?.teacherId)
      delete userSafe?.student?.teacher;

    if (
      userType == "teacher" &&
      !Array.isArray(userSafe?.teacher?.students) &&
      !(userSafe?.teacher?.students as any).studentId
    )
      delete userSafe?.teacher?.students;

    return LocaleDataResponse(res, 200, {
      user: userSafe,
      tokenType: "EJWT",
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

export async function GetUser(req: Request, res: Response, next: NextFunction) {
  try {
    const role: RoleType = req.params.role as any;
    const userId = req.params.userId;
    const _userId = req.CurrentUser?._userId;
    const roleId = req.CurrentUser?.roleId;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if ((role === "admin" || role === "super-admin") && roleId != "super-admin")
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let userCore = UserFactory(role);

    let user: User = (await userCore.GetUserByUuid({
      key: userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;

    return DataResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
}

export async function UpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role: RoleType = req.params.role as any;
    const userId = req.params.userId;
    const _userId = req.CurrentUser?._userId;
    const status = req.body.status;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (
      !StudentStatusEnum.includes(status as StudentStatus) &&
      !TeacherStatusEnum.includes(status as TeacherStatus)
    )
      throw new BadRequestError(...a("Invalid status type"));

    let userCore = UserFactory(role);
    let user: User = await userCore.UpdateUser(userId, status!);

    return DataResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
}

export async function GoogleLoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;

    let userType: RoleType = req.params.userType as RoleType;

    let verifiedGoogleUser = await GoogleCore.verifyAuth(data);
    if (!verifiedGoogleUser.isVerified)
      throw new BadRequestError(`You cannot be authorized at the moment.`);

    let user = await UserCore.GetUserCore(
      "email",
      data.email,
      SequelizeAttributes.WithIndexes
    );

    if (user && user.roleId != userType)
      throw new BadRequestError(`User with the same email already exists`);

    let userCore = UserFactory(userType);
    if (!user) user = (await userCore.GoogleLoginUser(data)) as any;

    const isNotVerified = !user.password ? true : false;
    const userSafe = (await userCore.GetUserById({
      key: user._userId!,
    } as any)) as any;

    let token = await TokenCore.IssueEJWT(user);

    if (userType == "student" && !userSafe?.student?.teacher?.teacherId)
      delete userSafe?.student?.teacher;

    if (
      userType == "teacher" &&
      !Array.isArray(userSafe?.teacher?.students) &&
      !(userSafe?.teacher?.students as any).studentId
    )
      delete userSafe?.teacher?.students;

    let userData = JSON.parse(JSON.stringify(userSafe));
    userData.isNotVerified = isNotVerified;

    return LocaleDataResponse(res, 200, {
      user: userData,
      tokenType: "EJWT",
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

export async function SetupPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _userId = req.CurrentUser?._userId;
    const role = req.CurrentUser?.roleId as RoleType;

    const { password, confirmPassword } =
      await UserPasswordSchema.validateAsync(req.body);

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!password) throw new BadRequestError(...a("Password is invalid."));

    if (password != confirmPassword)
      throw new BadRequestError(
        ...a("Password and confirm password does not match")
      );

    let userCore = UserFactory(role);
    let user = await userCore.GetUser({
      type: "_userId",
      key: _userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    });

    const updatedUser = await ProfileUtil.SetupPassword(password, _userId);
    // let message = updatedUser ? "Password set successfully" : "Password set was not successfully"
    // return DataResponse(res, 200, user, message)
    return DataResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
}

export async function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    if (!email) throw new BadRequestError(...a("email is invalid."));

    let user = await UserCore.GetUserCore(
      "email",
      email,
      SequelizeAttributes.WithIndexes,
      true
    );

    let auth = await ProfileUtil.ForgetPassword(user);

    let token = await TokenCore.IssueEJWT({ authId: auth.authId });

    token = encodeURIComponent(token);
    let emailFormat = generateEmailFormat(
      "Reset Password",
      `  Hello ${user.name}, Acesta este link-ul pentru resetarea parolei contului tău.
      Îți mulțumim că ne folosești platforma și te rugăm să ne contactezi dacă întâmpini alte probleme`,
      "",
      {
        text: "Reset password",
        href: `https://${user.roleId}.noName.ro/reset-password/${token}`,
      }
    );

    let sentMail = await Email.getInstance("NoReply").sendEmail(
      user.email,
      "Reset Password",
      emailFormat
    );

    return DataResponse(res, 200, {
      message: a("Email has been sent."),
      token: token,
    });
  } catch (err) {
    next(err);
  }
}

export async function ResetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, confirmPassword, token } = req.body;

    await UserPasswordSchema.validateAsync(req.body);
    if (!token)
      throw new BadRequestError(
        ...a("You are not authorized to access this resource.")
      );

    if (!password) throw new BadRequestError(...a("Password is invalid."));

    if (password != confirmPassword)
      throw new BadRequestError(
        ...a("Password and confirm password does not match.")
      );

    let decodedtoken = decodeURIComponent(token);

    let verifyToken = await TokenCore.VerifyEJWT(decodedtoken);

    if (!verifyToken.authId)
      throw new BadRequestError(
        ...a("You are not authorized to access this resource.")
      );

    let auth = await ResetAuthCore.GetResetAuthByUuid({
      key: verifyToken.authId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThroeNotFound: true,
    });

    if (moment().isAfter(auth.expiry) || auth.isUsed)
      throw new BadRequestError(...a("This link has been expired."));

    let resetPassword = await ProfileUtil.ResetPassword(
      auth._authId,
      password,
      auth.userId
    );
    let message = resetPassword
      ? "Password updated successfully"
      : "Password was not successfully updated";

    return DataResponse(res, 200, a(message));
  } catch (err) {
    next(err);
  }
}
