import { NextFunction, Response, Request } from "express";
import { Attempt, Option, Question } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { AttemptStartSchema, AttemptUpdateSchema, SubjectiveAttemptSchema } from "../../../sequelize/validation-schema";
import { AttemptCore } from "../../services/attempt";
import { TestCore } from "../../services/test";
import { UserFactory } from "../../services/user/user-factory";
import _ from 'lodash'
import { StudentTestCore } from "../../services/studentTest";
import moment from "moment";


export async function CreateAttempt(req: Request, res: Response, next: NextFunction) {
    try {
        let { studentTestId } = req.body
        let studentId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        await AttemptStartSchema.validateAsync({ studentTestId, studentId })

        if (!studentId && role != 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let studentTest = await StudentTestCore.GetStudentTestByUuid({
            key: studentTestId,
            returns: SequelizeAttributes.WithIndexes
        })

        if (studentTest) {

            if (moment().isBefore(moment(studentTest.startTime!)))
                throw new BadRequestError(...a('Cannot start the test before its start time'))

            if (moment().isAfter(studentTest.endTime!))
                return DataResponse(res, 400, { isSubmitted: true }, ...a(`Attempt is already submitted`))

            let attempt = await AttemptCore.CreateAttempt(studentTest.test!._testId,
                studentId!,
                studentTest._studentTestId)

            if (attempt.submittedAt)
                return DataResponse(res, 400, { isSubmitted: true },...a(`Attempt is already submitted`))

            let attemptsJSON = JSON.parse(JSON.stringify(attempt));
            attemptsJSON.test.questions?.forEach((q: Question) => {
                if (q.type == 1)
                    q.options.forEach((op: Option) => { delete op.isRight })
            })
            DataResponse(res, 200, attemptsJSON)
        }
        else {
            throw new BadRequestError(...a(`Can't start this test`))
        }


    } catch (err) {
        next(err)
    }
}

export async function UpdateAttempt(req: Request, res: Response, next: NextFunction) {

    try {
        let data = req.body
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        await AttemptUpdateSchema.validateAsync(data)

        if (!userId && role != 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let attemptData = await AttemptCore.GetAttemptByUuid({
            key: data.attemptId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        if (!attemptData)
            throw new BadRequestError(...a(`Attempt not found`))

        if (attemptData.submittedAt)
            return DataResponse(res, 400, { isSubmitted: true },...a(`Attempt is already submitted`))

        let studentTest = await StudentTestCore.GetStudentTestById({
            key: attemptData.studentTestId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        if (!studentTest)
            throw new BadRequestError(...a(`No test found`))

        if (moment().isBefore(moment(studentTest.startTime!)))
            throw new BadRequestError(...a('Cannot start the test before its start time'))

        if (moment().isAfter(studentTest.endTime!))
            return DataResponse(res, 400, { isSubmitted: true }, ...a(`Attempt is already submitted`))

        data._attemptId = attemptData._attemptId
        let attempt = await AttemptCore.UpdateAttempt(data)
        DataResponse(res, 200, attempt)

    } catch (err) {
        next(err)
    }
}

export async function GetAttempt(req: Request, res: Response, next: NextFunction) {

    try {
        let attemptId = req.params.attemptId
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let attempt = await AttemptCore.GetAttemptByUuid({
            key: attemptId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        if (role === 'teacher' && attempt.student.teacherId != req.CurrentUser?._userId)
            throw new BadRequestError(...a(`No attempt found of this student`))


        let attemptRes: Attempt
        let attemptsJSON = JSON.parse(JSON.stringify(attempt));

        attemptRes = _.omit(attemptsJSON, ['_attemptId', 'studentId', 'testId',
            'student.studentId', 'student.teacherId', 'student.user._userId',
            'test._testId', 'test.teacherId']) as any

        DataResponse(res, 200, attemptRes)
    } catch (err) {
        next(err)
    }
}

export async function UpdateSubjectiveMarks(req: Request, res: Response, next: NextFunction) {

    try {
        let data = req.body
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let attemptId = req.params?.attemptId

        let subjectiveAttempt = { "subjectiveAttempt": data }

        await SubjectiveAttemptSchema.validateAsync(subjectiveAttempt)

        if (!userId && role != "teacher")
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let attempt = await AttemptCore.UpdateSubjectiveAttempt(data, attemptId)
        DataResponse(res, 200, attempt)
    } catch (err) {
        next(err)
    }
}

export async function GetStudentTestAttemptsByTest(req: Request, res: Response, next: NextFunction) {
    try {

        const user = req.CurrentUser
        const roleId = req.CurrentUser?.roleId
        const studentId = req.params?.userId
        const testId = req.params?.testId
        const _userId = req.CurrentUser?._userId

        if (roleId === 'student' && user?.userId != studentId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let test = await TestCore.GetTestByUuid(testId, SequelizeAttributes.WithIndexes, true)
        let attempts: Attempt[] = []
        if (roleId === 'student') {
            attempts = await AttemptCore.GetAttemptByStudentIdAndTestId(_userId!, test._testId, SequelizeAttributes.WithIndexes)
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

            attempts = await AttemptCore.GetAttemptByTeacherStudentAndTestId(_userId!, userStudent?._userId!, test._testId)
        }

        let attemptRes: Attempt[] = []
        let attemptsJSON = JSON.parse(JSON.stringify(attempts));
        attemptsJSON.forEach((attempt: Attempt) => {
            attempt = _.omit(attempt, ['_attemptId', 'studentId', 'testId', 'student', 'test._testId', 'test.teacherId']) as any
            attemptRes.push(attempt)
        });

        return DataResponse(res, 200, attemptRes)

    } catch (err) {
        next(err)
    }
}

export async function GetStudentTestAttemptsByStudentTestId(req: Request, res: Response, next: NextFunction) {
    try {


        const roleId = req.CurrentUser?.roleId
        const studentTestId = req.params?.studentTestId

        if (!studentTestId)
            throw new UnAuthorizedError(...a(`please select a test`))

        if (roleId != 'student')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))


        let studentTest = await StudentTestCore.GetStudentTestByUuid({
            key: studentTestId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        if (!studentTest)
            throw new BadRequestError(...a(`No test found`))

        if (moment().isBefore(moment(studentTest.startTime!)))
            throw new BadRequestError(...a('Attempt will be available after its time end'))

        if (moment().isBefore(studentTest.endTime!))
            throw new BadRequestError(...a('Attempt will be available after its time end'))

        let attempt = await AttemptCore.GetAttemptByStudentTestId({
            key: studentTest._studentTestId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        let attemptRes: Attempt
        let attemptsJSON = JSON.parse(JSON.stringify(attempt));

        attemptRes = _.omit(attemptsJSON, ['_attemptId', 'studentId', 'testId',
            'student.studentId', 'student.teacherId', 'student.user._userId',
            'test._testId', 'test.teacherId']) as any


        return DataResponse(res, 200, attemptRes)

    } catch (err) {
        next(err)
    }
}



