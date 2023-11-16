import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import moment from "moment";
import { AssignmentAttempt, StudentAssignment } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";

import { BadRequestError, NotFoundError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { AssignmentSchema } from "../../../sequelize/validation-schema";
import { AssignUtil } from "../../services/assign";
import { AssignmentCore } from "../../services/assignment";
import { AssignmentAttemptCore } from "../../services/assignment-attempt";
import { StudentAssignmentCore } from "../../services/student-assignment";
import { UserFactory } from "../../services/user/user-factory";
import { CheckQueryPagingParams } from "../../utility";

export async function CreateAssignments(req: Request, res: Response, next: NextFunction) {
    try {
        let data = req.body
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!_userId)
            throw new UnAuthorizedError(...a( 'You are not authorized to access this resource.'))

        if (role != 'teacher')
            throw new BadRequestError(...a('You are not authorized to access this resource.'))

        await AssignmentSchema.validateAsync(data)

        data.teacherId = _userId
        let assignment = await AssignmentCore.CreateAssignment(data)

        DataResponse(res, 200, assignment)

    } catch (err) {
        next(err)
    }

}

export async function GetAssignments(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let studentId = req.params?.userId
        const queryParams = CheckQueryPagingParams(req.query)

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        let assignments , count = 1
        if (role == 'student') {
            assignments = await StudentAssignmentCore.GetStudentAssignmentByStudentId({
                key: _userId,
                shouldThrowNotFound: true,
                returns: SequelizeAttributes.WithIndexes,
                limit:queryParams.limit,
                offset:queryParams.offset
            } as any)
        }
        else if (role == 'teacher' && studentId) {

            let studentCore = UserFactory('student')
            let student = await studentCore.GetUserByUuid({
                key: studentId,
                returns: SequelizeAttributes.WithIndexes,
                shouldThrowNotFound: true
            }) as any

            assignments = await StudentAssignmentCore.GetStudentAssignmentByStudentId({
                key: student._userId,
                shouldThrowNotFound: true,
                returns: SequelizeAttributes.WithIndexes,
                limit:queryParams.limit,
                offset:queryParams.offset
            } as any)

            let assignmentIds = new Set();
            assignments.filter((t: StudentAssignment) => t.assignment!.teacherId == req.CurrentUser?._userId)
                .forEach((t: StudentAssignment) => assignmentIds.add(t.assignment!._assignmentId))

            
            let Ids = Array.from(assignmentIds.values()) as any
            count = Ids.length
            assignments = await StudentAssignmentCore.GetStudentAssignmentsWhereIn(student._userId, Ids, SequelizeAttributes.WithoutIndexes)
        }
        else {
            count= await AssignmentCore.GetAssignmentCountBy('teacherId', _userId)
            assignments = await AssignmentCore.GetAssignmentByTeacherId({
                 key: _userId ,
                 limit:queryParams.limit,
                 offset:queryParams.offset } as any)
        }

        let data ={
            "data":assignments,
            "count":count
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}

export async function GetAssignment(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let assignmentId = req.params?.assignmentId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        let assignment = await AssignmentCore.GetAssignmentByUUid({ key: assignmentId } as any)

        DataResponse(res, 200, assignment)

    } catch (err) {
        next(err)
    }
}

export async function DeleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let assignmentId = req.params?.assignmentId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        if (role == 'student')
            throw new BadRequestError(...a('You are not authorized to access this resource'))

        let assignment = await AssignmentCore.GetAssignmentByUUid({
            key: assignmentId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithIndexes
        } as any) as any

        let deleteAssignmentRes = await AssignmentCore.DeleteAssignment(assignment._assignmentId)

        let assignments = await AssignmentCore.GetAssignmentByTeacherId({ key: _userId } as any)
        DataResponse(res, 200, assignments)

    } catch (err) {
        next(err)
    }
}

export async function UpdateAssignments(req: Request, res: Response, next: NextFunction) {
    try {
        let data = req.body
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        if (role != 'teacher')
            throw new BadRequestError(...a('You are not authorized to access this resource'))

        await AssignmentSchema.validateAsync(data)
        if (moment(data.endDate).isBefore(data.startDate))
            throw new BadRequestError(...a('Please select valid date period.'))

        if (moment().isAfter(data.endDate))
            throw new BadRequestError(...a('End date must be greater than current date.'))

        let assignmentDb = await AssignmentCore.GetAssignmentByUUid({
            key: data.assignmentId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithIndexes
        } as any)

        data._assignmentId = assignmentDb._assignmentId

        let assignment = await AssignmentCore.UpdateAssignment(data)
        DataResponse(res, 200, assignment)

    } catch (err) {
        next(err)
    }

}

export async function AssignAssignment(req: Request, res: Response, next: NextFunction) {
    try {
        let { studentId, startDate, endDate } = req.body

        let assignmentId = req.params.assignmentId
        let roleId = req.CurrentUser?.roleId
        let teacherId = req.CurrentUser?._userId

        if (!studentId || !startDate || !endDate)
            throw new BadRequestError(...a('You are not authorized to access this resource'))

        if (moment(endDate).isBefore(moment(startDate)))
            throw new BadRequestError(...a('Please select a valid time period'))

        let studentCore = UserFactory('student')
        let user = await studentCore.GetUserByUuid({
            key: studentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        let assignment = await AssignmentCore.GetAssignmentByUUid({
            key: assignmentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any)

        if (roleId != 'teacher' ||
            user?.student?.teacher?.teacherId != teacherId ||
            assignment.teacherId != teacherId)
            throw new BadRequestError(...a(`You can not assign this assignment to selected student`))

        let assignmentAssign = await AssignUtil.AssignAssignmentToStudent({
            assignmentId: assignment._assignmentId,
            studentId: user?._userId!,
            startDate, endDate
        })

        DataResponse(res, 200, assignmentAssign)


    } catch (err) {
        next(err)
    }
}

export async function UnassignAssignment(req: Request, res: Response, next: NextFunction) {
    try {

        let { studentAssignmentId } = req.body
        let roleId = req.CurrentUser?.roleId

        if (roleId != 'teacher')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!studentAssignmentId)
            throw new BadRequestError(...a(`Please select a Assignment`))

        let assignment = await StudentAssignmentCore.GetStudentAssignmentByUuid({
            key: studentAssignmentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any)

        if (!assignment)
            throw new BadRequestError(...a(`selected assignment is not assigned to this student`))

        let unassignTest = await StudentAssignmentCore.UnassignStudentAssignment(assignment._studentAssignmentId)

        let assignments = await StudentAssignmentCore.GetUpcomingAssignmentByAssignmentId(assignment.assignmentId)

        DataResponse(res, 200, assignments)


    } catch (err) {
        next(err)
    }
}

export async function GetUpcomingAssignments(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let assignmentId = req.params?.assignmentId
        const queryParams = CheckQueryPagingParams(req.query)

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        if (!assignmentId)
            throw new BadRequestError(...a('You are not authorized to access this resource'))

        let assignment = await AssignmentCore.GetAssignmentByUUid({
            key: assignmentId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithIndexes
        } as any)
        


        let assignmentRes = await StudentAssignmentCore.GetUpcomingAssignmentByAssignmentId(assignment._assignmentId, SequelizeAttributes.WithoutIndexes)
        // assignmentRes.forEach((t: StudentAssignment) => {
        //     delete t.assignment
        // });
        DataResponse(res, 200, assignmentRes)

    } catch (err) {
        next(err)
    }
}

export async function GetPastAssignments(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let assignmentId = req.params?.assignmentId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        if (!assignmentId)
            throw new BadRequestError(...a('You are not authorized to access this resource'))

        let assignment = await AssignmentCore.GetAssignmentByUUid({
            key: assignmentId,
            shouldThrowNotFound: true,
            returns: SequelizeAttributes.WithIndexes
        } as any)


        let assignmentRes = await StudentAssignmentCore.GetPastAssignmentByAssignmentId(assignment._assignmentId, SequelizeAttributes.WithoutIndexes)

        DataResponse(res, 200, assignmentRes)

    } catch (err) {
        next(err)
    }
}

export async function GetUpcomingAllAssignments(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        let assignmentRes ,count = 1
        if (role == 'student'){
            assignmentRes = await StudentAssignmentCore.GetUpcomingAssignmentByStudentId(_userId, SequelizeAttributes.WithoutIndexes)
            count = await StudentAssignmentCore.GetUpcomingStudentAssignmentsCountBy('studentId',_userId)
        }

        else if(role == 'teacher'){
            let assignments = await AssignmentCore.GetAssignmentByTeacherId({key:_userId , returns:SequelizeAttributes.WithIndexes})
            let assignmentsIds = new Set();
            assignments.forEach((t: any) => assignmentsIds.add(t._assignmentId))
            let Ids = Array.from(assignmentsIds.values()) as any

            assignmentRes = await StudentAssignmentCore.GetUpcomingAssignmentsWhereInByAssignmentIds(Ids,SequelizeAttributes.WithoutIndexes)
          
        }

        let data = {
            "data":assignmentRes,
            "count" :count
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}

export async function GetPastAllAssignments(req: Request, res: Response, next: NextFunction) {
    try {

        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!_userId)
            throw new UnAuthorizedError(...a('You are not authorized to access this resource'))

        let assignmentRes , count = 1
        if (role == 'student'){
            assignmentRes = await StudentAssignmentCore.GetPastAssignmentByStudentId(_userId, SequelizeAttributes.WithIndexes)
            count = await StudentAssignmentCore.GetPastStudentAssignmentsCountBy('studentId',_userId)
        }
        else if (role == 'teacher'){
            let assignments = await AssignmentCore.GetAssignmentByTeacherId({key:_userId , returns:SequelizeAttributes.WithIndexes})
            let assignmentsIds = new Set();
            assignments.forEach((t: any) => assignmentsIds.add(t._assignmentId))
            let Ids = Array.from(assignmentsIds.values()) as any

            assignmentRes = await StudentAssignmentCore.GetPastAssignmentsWhereInByAssignmentIds(Ids,SequelizeAttributes.WithoutIndexes)
        }

        let studentAssignmentIds = assignmentRes.map((stdAssignment: any) => stdAssignment._studentAssignmentId)

        let assignmentAttempts: any[] = []
        studentAssignmentIds.forEach((id: any) => {
            assignmentAttempts.push(AssignmentAttemptCore.GetAssignmentAttemptByStudentAssignmentId({
                key: id,
                returns: SequelizeAttributes.WithIndexes
            } as any))
        });

        let assignmentAttemptRes = await Promise.all(assignmentAttempts)
        let assignmentResJson = JSON.parse(JSON.stringify(assignmentRes))

        let pastAssignmentRes = []
        for (let stdAssignment of assignmentResJson) {
            let assignmentAttempt = assignmentAttemptRes.find(attempt => attempt?.studentAssignmentId == stdAssignment._studentAssignmentId)
            stdAssignment.assignmentAttempt = assignmentAttempt ? JSON.parse(JSON.stringify(assignmentAttempt)) : undefined

            delete stdAssignment.student
            delete stdAssignment.assignment.content
            delete stdAssignment.assignment.teacher
            delete stdAssignment.assignmentAttempt?.answerText
            delete stdAssignment.assignmentAttempt?.assignment
            delete stdAssignment.assignmentAttempt?.student

            let OmitStdAssignment = _.omit(stdAssignment, [
                '_studentAssignmentId', 'assignmentId', 'studentId',
                'assignment._assignmentId', 'assignment.teacherId',
                'assignmentAttempt._assignmentAttemptId', 'assignmentAttempt.studentId',
                'assignmentAttempt.assignmentId', 'assignmentAttempt.studentAssignmentId'])

            pastAssignmentRes.push(OmitStdAssignment)
        }

        let data= {
            "data" : pastAssignmentRes,
            "count" :count
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}