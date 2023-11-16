import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { a } from "../../../sequelize/locales"
import { SequelizeAttributes } from "../../../sequelize/types"
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors"
import { DataResponse } from "../../../sequelize/utils/http-response"
import { AssignmentCore } from "../../services/assignment"
import { AssignmentAttemptCore } from "../../services/assignment-attempt"
import { StudentAssignmentCore } from "../../services/student-assignment"
import { UserFactory } from "../../services/user/user-factory"
import { AssignAssignment } from "../assignment"

export async function CreateAssignmentAttempt(req: Request, res: Response, next: NextFunction) {
    try {
        let { studentAssignmentId } = req.body
        let studentId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!studentId && role != 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let studentAssignment = await StudentAssignmentCore.GetStudentAssignmentByUuid({
            key: studentAssignmentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any)


        if (moment().isBefore(moment(studentAssignment.startDate!)))
            throw new BadRequestError(...a('Cannot start the assignment before its start date'))

        if (moment().isAfter(studentAssignment.endDate!))
            throw new BadRequestError(...a('Now you cannot attempt this assignment'))

        let assignmentAttempt = await AssignmentAttemptCore.CreateAssignmentAttempt(studentAssignment.assignmentId,
            studentId!,
            studentAssignment._studentAssignmentId)

        DataResponse(res, 200, assignmentAttempt)

    } catch (err) {
        next(err)
    }
}

export async function UpdateAssignmentAttempt(req: Request, res: Response, next: NextFunction) {
    try {
        let data = req.body
        let studentId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!studentId && role != 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let assignmentAttempt = await AssignmentAttemptCore.GetAssignmentAttemptByUuid({
            key: data.assignmentAttemptId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any)


        // if (assignmentAttempt.submittedAt)
        //     throw new BadRequestError(...a(`Attempt is already submitted`))

        let studentAssignment = await StudentAssignmentCore.GetStudentAssignmentById({
            key: assignmentAttempt.studentAssignmentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any)

        if (moment().isBefore(moment(studentAssignment.startDate!)))
            throw new BadRequestError(...a('Cannot start the assignment before its start date'))

        if (moment().isAfter(studentAssignment.endDate!))
            throw new BadRequestError(...a('Now you cannot attempt this assignment'))

        delete data.assignmentAttemptId
        data.submittedAt = moment()

        let updateAssignmentAttempt = await AssignmentAttemptCore.UpdateAssignmentAttempt(data,
            assignmentAttempt._assignmentAttemptId)

        DataResponse(res, 200, updateAssignmentAttempt)

    } catch (err) {
        next(err)
    }
}

export async function GetAssignmentAttempt(req: Request, res: Response, next: NextFunction) {
    try {
        let { assignmentAttemptId } = req.params
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!assignmentAttemptId)
            throw new UnAuthorizedError(...a(`Please select an assignment attempt.`))

        let assignmentAttempt = await AssignmentAttemptCore.GetAssignmentAttemptByUuid({
            key: assignmentAttemptId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithoutIndexes
        } as any)

        DataResponse(res, 200, assignmentAttempt)

    } catch (err) {
        next(err)
    }
}

export async function UpdateAssignmentAttemptMarks(req: Request, res: Response, next: NextFunction) {
    try {
        let { obtainedMarks } = req.body
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let assignmentAttemptId = req.params.assignmentAttemptId

        if (!userId && role != 'teacher')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let assignmentAttempt = await AssignmentAttemptCore.GetAssignmentAttemptByUuid({
            key: assignmentAttemptId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithIndexes
        } as any)

        let data = { obtainedMarks }
        let updateAssignmentAttempt = await AssignmentAttemptCore.UpdateAssignmentAttempt(data,
            assignmentAttempt._assignmentAttemptId)

        DataResponse(res, 200, updateAssignmentAttempt)

    } catch (err) {
        next(err)
    }
}

export async function GetStudentAssignmentAttemptsByAssignment(req: Request, res: Response, next: NextFunction) {
    try {

        const user = req.CurrentUser
        const roleId = req.CurrentUser?.roleId
        const studentId = req.params?.userId
        const assignmentId = req.params?.assignmentId
        const _userId = req.CurrentUser?._userId

        if (roleId === 'student' && user?.userId != studentId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let assignment = await AssignmentCore.GetAssignmentByUUid({
            key: assignmentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        let assignmentAttempts: any[] = []
        if (roleId === 'student') {

            assignmentAttempts = await AssignmentAttemptCore.GetAssignmentAttemptByStudentAndAssignmentId(
                _userId as any,
                assignment._assignmentId,
                SequelizeAttributes.WithoutIndexes,
                true)
        }

        if (roleId === 'teacher') {
            let studentCore = UserFactory('student')
            let userStudent = await studentCore.GetUserByUuid({
                key: studentId,
                returns: SequelizeAttributes.WithIndexes,
                shouldThrowNotFound: true
            })

            if (userStudent!.student?.teacherId != user?._userId)
                throw new BadRequestError(...a(`No attempt found of this student`))

            assignmentAttempts = await AssignmentAttemptCore.GetAssignmentAttemptByStudentTeacherAndAssignmentId(
                userStudent?._userId!,
                _userId!,
                assignment._assignmentId,
                SequelizeAttributes.WithoutIndexes,
                true
            )
        }

        return DataResponse(res, 200, assignmentAttempts)

    } catch (err) {
        next(err)
    }
}