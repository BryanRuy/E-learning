import _ from "lodash"
import { Assignment, AssignmentAttempt, Student, Teacher, User } from "../../../sequelize"
import { a } from "../../../sequelize/locales"
import { SequelizeAttributes } from "../../../sequelize/types"
import { NotFoundError } from "../../../sequelize/utils/errors"

export type searchAssignmentAttempt = '_assignmentAttemptId' | 'assignmentAttemptId' | 'assignmentId' | 'studentId' | 'studentAssignmentId'

export interface AssignAttemptArgs {
    type?: searchAssignmentAttempt
    key: any,
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean
}

export class AssignmentAttemptCore {

    private static setDefaultValues(args: AssignAttemptArgs) {
        const _args = _.clone(args)
        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        return _args
    }

    private static async GetAssignmentAttempts(_args: AssignAttemptArgs): Promise<AssignmentAttempt[]> {
        let args = this.setDefaultValues(_args)
        let assignmentAttempt = await AssignmentAttempt.findAllSafe<AssignmentAttempt[]>(args.returns, {
            include: [{
                model: Student,
                include: [User]
            }, {
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }]

            }],
            where: {
                [args.type!]: args.key
            }
        })
        if (assignmentAttempt.length <= 0 && args.shouldThrowNotFound) {
            throw new NotFoundError(...a(`Attempt Not found`))
        }
        return assignmentAttempt
    }

    static async GetAssignmentAttemptById(args: AssignAttemptArgs): Promise<AssignmentAttempt> {
        args.type = '_assignmentAttemptId'
        let assignmentAttempts = await this.GetAssignmentAttempts(args)
        return assignmentAttempts[0]
    }

    static async GetAssignmentAttemptByUuid(args: AssignAttemptArgs): Promise<AssignmentAttempt> {
        args.type = 'assignmentAttemptId'
        let assignmentAttempts = await this.GetAssignmentAttempts(args)
        return assignmentAttempts[0]
    }

    static async GetAssignmentAttemptByStudentAssignmentId(args: AssignAttemptArgs): Promise<AssignmentAttempt> {
        args.type = 'studentAssignmentId'
        let assignmentAttempts = await this.GetAssignmentAttempts(args)
        return assignmentAttempts[0]
    }

    static async GetAssignmentAttemptByStudentId(args: AssignAttemptArgs): Promise<AssignmentAttempt[]> {
        args.type = 'studentId'
        let assignmentAttempts = await this.GetAssignmentAttempts(args)
        return assignmentAttempts
    }

    static async GetAssignmentAttemptByStudentAndAssignmentId(studentId: number, assignmentId: number, returns = SequelizeAttributes.WithoutIndexes, shouldThrowNotFound: boolean = false): Promise<AssignmentAttempt[]> {
        let assignmentAttempt = await AssignmentAttempt.findAllSafe<AssignmentAttempt[]>(returns, {
            include: [{
                model: Student,
                include: [User]
            }, {
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }]

            }],
            where: {
                studentId: studentId,
                assignmentId: assignmentId
            }
        })
        if (assignmentAttempt.length <= 0 && shouldThrowNotFound) {
            throw new NotFoundError(...a(`Attempt Not found`))
        }
        return assignmentAttempt
    }

    static async GetAssignmentAttemptByStudentTeacherAndAssignmentId(studentId: number, teacherId: number, assignmentId: number, returns = SequelizeAttributes.WithoutIndexes, shouldThrowNotFound: boolean = false): Promise<AssignmentAttempt[]> {
        let assignmentAttempt = await AssignmentAttempt.findAllSafe<AssignmentAttempt[]>(returns, {
            include: [{
                model: Student,
                include: [User],
                where: {
                    studentId: studentId,
                    teacherId: teacherId
                }
            }, {
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }]

            }],
            where: {
                assignmentId: assignmentId
            }
        })
        if (assignmentAttempt.length <= 0 && shouldThrowNotFound) {
            throw new NotFoundError(...a(`Attempt Not found`))
        }
        return assignmentAttempt
    }


    static async GetAssignmentAttemptByAssignmentId(args: AssignAttemptArgs): Promise<AssignmentAttempt[]> {
        args.type = 'assignmentId'
        let assignmentAttempts = await this.GetAssignmentAttempts(args)
        return assignmentAttempts
    }

    static async CreateAssignmentAttempt(assignmentId: number, studentId: number, studentAssignmentId: number): Promise<AssignmentAttempt> {

        let newAssignmentAttempt = await AssignmentAttempt.findOrCreateSafe<AssignmentAttempt>(SequelizeAttributes.WithIndexes, {
            defaults: {
                assignmentId: assignmentId,
                studentId: studentId,
                studentAssignmentId: studentAssignmentId
            } as any,
            where: { studentAssignmentId: studentAssignmentId },
        })

        let assignmentAttemptRes = await this.GetAssignmentAttemptById({
            key: newAssignmentAttempt[0]._assignmentAttemptId
        } as any)
        return assignmentAttemptRes!
    }

    static async UpdateAssignmentAttempt(data: any, assignmentAttemptId: number): Promise<AssignmentAttempt> {

        let updateAssignmentAttempt = await AssignmentAttempt.update({
            ...data
        }, {
            where: { _assignmentAttemptId: assignmentAttemptId }
        })

        let assignmentAttemptRes = await this.GetAssignmentAttemptById({
            key: assignmentAttemptId
        } as any)
        return assignmentAttemptRes!
    }

}