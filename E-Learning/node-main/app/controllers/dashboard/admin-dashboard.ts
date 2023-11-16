import { NextFunction, Response, Request } from "express";
import { a } from "../../../sequelize/locales";
import { StudentTeacherHistory } from "../../../sequelize/models/StudentTeacherHistory";
import { SequelizeAttributes, StudentStatus } from "../../../sequelize/types";
import { UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { AdminDashboardCore } from "../../services/dashboard/admin-dashboard";
import { StudentTeachertHistoryCore } from "../../services/student-teacher-history";
import { UserCore } from "../../services/user/user-core";
import { CheckQueryPagingParams } from "../../utility";


export async function AdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let params = CheckQueryPagingParams(req.query)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let Students = await AdminDashboardCore.GetAllUser('student', params.limit, params.offset)
        let Teachers = await AdminDashboardCore.GetAllUser('teacher', params.limit, params.offset)

        let newTeachers = await AdminDashboardCore.GetUserOf('month', 'teacher')
        let newStudents = await AdminDashboardCore.GetUserOf('month', 'student')
        let yearlySignUpUser = await AdminDashboardCore.GetYearlySignUpUserCount()

        let data = {
            newStudentsCount: newStudents.length,
            newTeachersCount: newTeachers.length,
            studentsCount: Students.count,
            teachersCount: Teachers.count,
            students: Students.rows,
            teachers: Teachers.rows,
            yearlySignUpUser
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}

export async function GetYearlySignUpUserCount(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let year = req.params.year

        if (!user || (user.roleId != 'admin' && user.roleId != 'super-admin') )
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!year)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let yearlySignUpUser = await AdminDashboardCore.GetYearlySignUpUserCount(year)
        DataResponse(res, 200, yearlySignUpUser)

    } catch (err) {
        next(err)
    }
}

export async function GetTeacherStats(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let params = CheckQueryPagingParams(req.query)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))


        let teacherDashboardData: any[] = []
        teacherDashboardData.push(AdminDashboardCore.GetUserOf('month', 'teacher'))
        teacherDashboardData.push(AdminDashboardCore.GetUserOf('year', 'teacher'))
        teacherDashboardData.push(AdminDashboardCore.GetAllUser('teacher', params.limit, params.offset))
        teacherDashboardData.push(AdminDashboardCore.GetAllActiveTeacher())

        let allRes = await Promise.all(teacherDashboardData)

        let teachers = {
            "pages": allRes[2].count,
            "data": allRes[2].rows
        }


        let data = {
            'thisMonthCount': allRes[0].length,
            'thisYearCount': allRes[1].length,
            'allTimeCount': allRes[2].count,
            'activeCount': allRes[3].length,
            'teachers': teachers
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }

}

export async function GetTeacherHistoryStats(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let { teacherId } = req.params
        let params = CheckQueryPagingParams(req.query)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!teacherId)
            throw new UnAuthorizedError(...a(`Plase select a teacher`))

        let teacherHistoryData: any[] = []
        user = await UserCore.GetUserCore('userId', teacherId, SequelizeAttributes.WithIndexes, true)
        teacherHistoryData.push(StudentTeachertHistoryCore.GetStudentTeacherHistoryByTeacherId({
            key: user._userId,
            shouldThrowNotFound: true,
            limit: params.limit,
            offset: params.offset
        }))


        let allRes = await Promise.all(teacherHistoryData)

        let history = {
            "pages": allRes[0].count,
            "data": allRes[0].rows
        }


        let data = {
            'payments': { "pages": 0, "data": [] },
            'history': history
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }

}

export async function GetStudentStats(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let params = CheckQueryPagingParams(req.query)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))


        let studentDashboardData: any[] = []
        studentDashboardData.push(AdminDashboardCore.GetUserOf('month', 'student'))
        studentDashboardData.push(AdminDashboardCore.GetUserOf('year', 'student'))
        studentDashboardData.push(AdminDashboardCore.GetAllUser('student', params.limit, params.offset))
        studentDashboardData.push(AdminDashboardCore.GetAllStudentByStatus(['active'], params.limit, params.offset))

        let allRes = await Promise.all(studentDashboardData)

        let students = {
            "pages": allRes[3].count,
            "data": allRes[3].rows
        }

        let data = {
            'thisMonthCount': allRes[0].length,
            'thisYearCount': allRes[1].length,
            'allTimeCount': allRes[2].count,
            'activeCount': allRes[3].count,
            'students': students
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }

}

export async function GetStudentHistoryStats(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let { studentId } = req.params
        let params = CheckQueryPagingParams(req.query)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!studentId)
            throw new UnAuthorizedError(...a(`Please select a student`))

        let teacherHistoryData: any[] = []
        user = await UserCore.GetUserCore('userId', studentId, SequelizeAttributes.WithIndexes, true)
        teacherHistoryData.push(StudentTeachertHistoryCore.GetStudentTeacherHistoryByStudentId({
            key: user._userId,
            shouldThrowNotFound: true,
            limit: params.limit,
            offset: params.offset
        }))


        let allRes = await Promise.all(teacherHistoryData)

        let history = {
            "pages": allRes[0].count,
            "data": allRes[0].rows
        }


        let data = {
            'history': history
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }

}

export async function GetStudentsByStatus(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        let params = CheckQueryPagingParams(req.query)
        const isActiveStudent = req.query.isActiveStudent
        const name = req.query.name

        let status: StudentStatus[] = []

        if (!user)
            throw new UnAuthorizedError(...a(`You are not aut  horized to access this resource`))

        if (isActiveStudent == "true") status = ['active']
        else status = ['new', 'waiting-for-teacher']

        let students = await AdminDashboardCore.GetAllStudentByStatus(status, params.limit, params.offset, name) as any

        let data = {
            "pages": students.count,
            "data": students.rows
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }

}