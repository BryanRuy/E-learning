import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { UnAuthorizedError } from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { UserFactory } from "../../services/user/user-factory";
import { SequelizeAttributes } from "../../../sequelize/types";
import { SuperAdminCore } from "../../services/super-admin";


export async function GetSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {

        const roleId = req.CurrentUser!.roleId
        const userId = req.params!.userId

        if (roleId != 'super-admin' || userId != req.CurrentUser?.userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let adminCore = UserFactory('super-admin')
        const admin = await adminCore.GetUserByUuid({
            key: userId,
            returns: SequelizeAttributes.WithoutIndexes,
            shouldThrowNotFound: true
        } as any) as any

        return DataResponse(res, 200, admin)

    } catch (err) {
        next(err)
    }
}

export async function GetSuperAdmins(req: Request, res: Response, next: NextFunction) {
    try {

        const userId = req.params?.userId
        const roleId = req.CurrentUser?.roleId

        if (roleId != 'super-admin' || userId != req.CurrentUser?.userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        const admins = await SuperAdminCore.GetSuperAdmins()
        return DataResponse(res, 200, admins)

    } catch (err) {
        next(err)
    }
}
