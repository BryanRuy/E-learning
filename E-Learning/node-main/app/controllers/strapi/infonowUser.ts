import { Request, Response, NextFunction } from "express";
import { a } from "../../../sequelize/locales";
import { UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { noNameUserUtil } from "../../services/strapi";

export async function GetnoNameUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;

    if (role == "teacher" || role == "student")
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let writers = await noNameUserUtil.GetnoNameUsersStarpi();
    DataResponse(res, 200, writers);
  } catch (err) {
    next(err);
  }
}

export async function GetnoNameUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let noNameUserId = req.params.noNameUserId as any;
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;

    if (role == "teacher" || role == "student")
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let writer = await noNameUserUtil.GetnoNameUserStarpi(noNameUserId);
    DataResponse(res, 200, writer);
  } catch (err) {
    next(err);
  }
}
