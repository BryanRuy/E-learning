import { NextFunction, Request, Response } from "express";
import { AssignUtil } from "../../services/assign";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { UnAuthorizedError } from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { AssignTeacherSchema } from "../../../sequelize/validation-schema";
import { UserFactory } from "../../services/user/user-factory";
import { SequelizeAttributes } from "../../../sequelize/types";
import { AdminCore } from "../../services/admin";
import { CheckQueryPagingParams } from "../../utility";



export async function AssignTeacherToStudent(req: Request, res: Response, next: NextFunction) {
    try {
        const { studentId, teacherId } = req.body;
        const roleId = req.CurrentUser!.roleId

        await AssignTeacherSchema.validateAsync({ studentId, teacherId })
        if (roleId == 'teacher' || roleId == 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))


        const studentsOfTeacher = await AssignUtil.AssignTeacherToStudent(teacherId, studentId)

        return DataResponse(res, 200, studentsOfTeacher)

    } catch (err) {
        next(err)
    }
}

export async function UnassignTeacher(req: Request, res: Response, next: NextFunction) {
    try {
        const { studentId } = req.body;
        const roleId = req.CurrentUser!.roleId
                
        if (roleId == 'teacher' || roleId == 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        const student = await AssignUtil.UnassignTeacherToStudent(studentId)

        return DataResponse(res, 200, student)

    } catch (err) {
        next(err)
    }
}

export async function GetAdmin(req: Request, res: Response, next: NextFunction) {
    try {

        const roleId = req.CurrentUser!.roleId
        const userId = req.params!.userId

        if (roleId === 'student' || roleId === 'teacher' ||
            (roleId === 'admin' && userId != req.CurrentUser?.userId))
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let adminCore = UserFactory('admin')
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

export async function GetAdmins(req: Request, res: Response, next: NextFunction) {
    try {

        const userId = req.params?._userId
        const roleId = req.CurrentUser?.roleId
        const name = req.query.name
        const queryParams = CheckQueryPagingParams(req.query)

        if (roleId != 'super-admin')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        const admins = await AdminCore.GetAdmins(queryParams.offset, queryParams.limit,name)
        const count = await AdminCore.GetAdminsCount(name)
        return DataResponse(res, 200, {"data":admins,"count":count})

    } catch (err) {
        next(err)
    }
}

