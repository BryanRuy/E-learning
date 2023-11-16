import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { SequelizeAttributes, StudentStatus, StudentStatusEnum } from "../../../sequelize/types";
import { StudentCore } from "../../services/student";
import { a } from "../../../sequelize/locales";
import { UserFactory } from "../../services/user/user-factory";
import { Student, User } from "../../../sequelize";
import { TestCore } from "../../services/test";
import { TeacherCore } from "../../services/teacher";
import { CheckQueryPagingParams } from "../../utility";
import { StudentTeachertHistoryCore } from "../../services/student-teacher-history";


export async function GetTeacher(req: Request, res: Response, next: NextFunction) {
    try {

        const user = req.CurrentUser!
        const roleId = user.roleId
        const _userId = user._userId
        const userId = req.params?.userId

        let studentUuid = user.teacher?.students?.find(s => s.user.userId === userId)?.user.userId
        if ((roleId === 'teacher' && userId === studentUuid) ||
            (roleId === 'student' && user.userId !== userId))
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))


        const teacher = await StudentCore.GetTeacher(_userId!, SequelizeAttributes.WithoutIndexes, true)
        return DataResponse(res, 200, teacher)

    } catch (err) {
        next(err)
    }
}


export async function GetStudentByEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.CurrentUser
        const roleId = req.CurrentUser?.roleId
        const studentEmail = req.params?.email


        let student;
        if (roleId === 'student' || roleId === 'teacher')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))
        else {
            let studentCore = UserFactory('student')
            student = await studentCore.GetUserByEmail({
                key: studentEmail,
                returns: SequelizeAttributes.WithoutIndexes,
                shouldThrowNotFound: true
            } as any) as any
        }

        if (student) return DataResponse(res, 200, student)
        else { return DataResponse(res, 200, [], 'No Student found') }

    } catch (err) {
        next(err)
    }
}


export async function GetStudent(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.CurrentUser
        const roleId = req.CurrentUser?.roleId
        const studentId = req.params?.userId


        let student;
        if (roleId === 'student' && studentId != user!.userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (roleId === 'teacher') {
            let teacherCore = UserFactory('teacher')
            let userTeacher = await teacherCore.GetUserById({
                key: user?._userId!,
                returns: SequelizeAttributes.WithoutIndexes,
                shouldThrowNotFound: true
            });
            student = userTeacher?.teacher?.students?.find(x => x.user.userId === studentId);
        }
        else {
            let studentCore = UserFactory('student')
            student = await studentCore.GetUserByUuid({
                key: studentId,
                returns: SequelizeAttributes.WithoutIndexes,
                shouldThrowNotFound: true
            } as any) as any
        }

        if (student) return DataResponse(res, 200, student)
        else { return DataResponse(res, 200, [], 'No Student found') }

    } catch (err) {
        next(err)
    }
}

export async function GetActiveStudents(req: Request, res: Response, next: NextFunction) {
    try {
        const roleId = req.CurrentUser?.roleId
        const _userId = req.CurrentUser?._userId

        const name = req.query.name
        const queryParams = CheckQueryPagingParams(req.query)

        if (roleId == 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let students, count = 1
          if(roleId === 'teacher'){
              students = await StudentCore.GetStudentOfTeacher('teacherId',req.CurrentUser?._userId,queryParams)
              count = await StudentCore.GetCountOfStudentOfTeacher('teacherId',req.CurrentUser?._userId)
            // students =  await TeacherCore.GetStudentsOfTeacher(req.CurrentUser?._userId!,queryParams.limit,queryParams.offset, SequelizeAttributes.WithoutIndexes, true)
            // count = await TeacherCore.GetStudentsOfTeacherCount(req.CurrentUser?._userId!)
          }
          else {
            students = await StudentCore.GetStudents(queryParams.limit, queryParams.offset,name)
          }
            
        let data ={
            "data":students,
            "count":count
        }

        return DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}

export async function UpdateStudentStatus(req: Request, res: Response, next: NextFunction) {
    try {

        const userId = req.params.userId;
        const roleId = req.CurrentUser?.roleId
        const status = req.body.status

        if (roleId === 'student' || roleId == 'teacher')
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!StudentStatusEnum.includes(status as StudentStatus))
            throw new BadRequestError(...a("Invalid status type"))

        let userCore = UserFactory('student')
        let user: User = await userCore.UpdateUser(userId, status!)

        DataResponse(res, 200, user)

    } catch (err) {
        next(err)
    }
}


export async function GetAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
        const roleId = req.CurrentUser?.roleId
        const _userId = req.CurrentUser?._userId

        const name = req.query.name
        const queryParams = CheckQueryPagingParams(req.query)

        if (roleId == 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let students : any
        if (roleId === 'teacher') {
            students = await StudentTeachertHistoryCore.GetDistinctStudentTeacherHistoryByTeacherId({
                key: _userId,
                limit: queryParams.limit,
                offset: queryParams.offset
            })
            
            let studentSet = new Map()
            students.forEach((e :any) =>{
                if(e.student.user)
                    studentSet.set(e.student.user.userId, e.student.user )
            })
            students= []
            for (let std of studentSet.values()) {
                students.push(std);
            }
        
        } else {
            students = await StudentCore.GetStudents(queryParams.limit, queryParams.offset,name)
        }

      DataResponse(res, 200, students)

    } catch (err) {
        next(err)
    }
}



