import _ from "lodash"
import moment from "moment"
import { StudentTest, op as Op, User, Student, StudentAssignment, Assignment, Teacher, AssignmentAttempt } from "../../../sequelize"
import { a } from "../../../sequelize/locales"
import { SequelizeAttributes } from "../../../sequelize/types"
import { NotFoundError } from "../../../sequelize/utils/errors"

export type searchStdAssignment = '_studentAssignmentId' | 'studentAssignmentId' | 'studentId' | 'assignmentId'

export interface studentAssignmentCore {
    type: searchStdAssignment
    key: any
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean
    limit?:number
    offset?:number
}

export class StudentAssignmentCore {

    private static setDefaultValues(args: studentAssignmentCore) {
        const _args = _.clone(args)
        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        _args.limit = _args.limit ?? 20
        _args.offset = _args.offset ?? 0
        return _args
    }

    private static async GetStudentAssignments(_args: studentAssignmentCore): Promise<StudentAssignment[]> {
        let args = this.setDefaultValues(_args)
        let studentAssignment = await StudentAssignment.findAllSafe<StudentAssignment[]>(args.returns, {
            include: [{
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }]
            }],
            where: { [args.type]: args.key },
            nest: true,
            limit:args.limit,
            offset:args.offset
        }) 

         if(studentAssignment.length == 0 && args.shouldThrowNotFound)
         throw new NotFoundError(...a('No student assignment found.'))
            

        return studentAssignment 
    }

    static async GetStudentAssignmentById(_args: studentAssignmentCore): Promise<StudentAssignment> {
        _args.type = '_studentAssignmentId'
        let studentAssignment = await this.GetStudentAssignments(_args)
        return studentAssignment[0]
    }

    static async GetStudentAssignmentByUuid(_args: studentAssignmentCore): Promise<StudentAssignment> {
        _args.type = 'studentAssignmentId'
        let studentAssignment = await this.GetStudentAssignments(_args)
        return studentAssignment[0]
    }

    static async GetStudentAssignmentByStudentId(_args: studentAssignmentCore): Promise<StudentAssignment[]> {
        _args.type = 'studentId'
        return this.GetStudentAssignments(_args)
    }

    static async GetStudentAssignmentsWhereIn(studentId: number, assignmentId: number[], returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentAssignment.findAllSafe(returns, {
            include: [{
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }],
                where: {
                    _assignmentId: {
                        [Op.in]: assignmentId
                    }
                }
            }],
            group: 'studentAssignmentId',
            where: {
                studentId: studentId
            },
            raw: true,
            nest: true
        }) as any

        return studentTest
    }

    static async GetUpcomingAssignmentsWhereInByAssignmentIds(assignmentIds: number[],  returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentAssignment.findAllSafe(returns, {
            include: [{
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }],
                where: {
                    _assignmentId: {
                        [Op.in]: assignmentIds
                    }
                }
            }],
            where: {
                endDate: {
                    [Op.gt]: moment().toDate()
                }
            },
            group: 'studentAssignmentId',
            raw: true,
            nest: true
        }) as any

        return studentTest
    }
    
    static async GetPastAssignmentsWhereInByAssignmentIds(assignmentIds: number[],  returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentAssignment.findAllSafe(returns, {
            include: [{
                model: Assignment,
                include: [{
                    model: Teacher,
                    include: [User]
                }],
                where: {
                    _assignmentId: {
                        [Op.in]: assignmentIds
                    }
                }
            }],
            where: {
                endDate: {
                    [Op.lt]: moment().toDate()
                }
            },
            group: 'studentAssignmentId',
            raw: true,
            nest: true
        }) as any

        return studentTest
    }

    static async UnassignStudentAssignment(studentAssignmentId: number): Promise<any> {

        let unassignAssignment = await StudentAssignment.destroy({
            where: { _studentAssignmentId: studentAssignmentId }
        })

        return unassignAssignment
    }

    static async GetUpcomingAssignmentByStudentId(studentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentAssignmentsBy('studentId', studentId, returns)
    }

    static async GetUpcomingAssignmentByAssignmentId(assignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentAssignmentsBy('assignmentId', assignmentId, returns)
    }

    static async GetUpcomingAssignmentByStudentAssignmentId(_studentAssignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentAssignmentsBy('_studentAssignmentId', _studentAssignmentId, returns)
    }

    static async GetUpcomingAssignmentByStudentAssignmentUuid(studentAssignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentAssignmentsBy('studentAssignmentId', studentAssignmentId, returns)
    }

    private static async GetUpcomingStudentAssignmentsBy(type: searchStdAssignment, key: any, returns: SequelizeAttributes) {
        let studentAssignment = await StudentAssignment.findAll({
            include: [{
                model: Student,
                attributes:{exclude:['teacherId','studentId']},
                include: [{
                    model:User,
                    attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                }]
            }, {
                model: Assignment,
                attributes:{exclude:['teacherId','_assignmentId']},
                include: [{
                    model: Teacher,
                    attributes:{exclude:['teacherId']},
                    include: [{
                        model:User,
                        attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                    }]
                }]
            }],
            attributes:{exclude:['_studentAssignmentId','assignmentId','studentId']},
            where: {
                [type]: key,
                endDate: {
                    [Op.gt]: moment().toDate()
                }

            },
            group: 'studentAssignmentId',
            nest: true,
            raw: true
        }) as any

        return studentAssignment as any
    }

    static async GetUpcomingStudentAssignmentsCountBy(type: searchStdAssignment, key: any):Promise<number> {
        let studentAssignmentCount = await StudentAssignment.count({
            where: {
                [type]: key,
                endDate: {
                    [Op.gt]: moment().toDate()
                }
            }
        }) 
        return studentAssignmentCount 
    }

    static async GetPastAssignmentByStudentId(studentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentAssignmentsBy('studentId', studentId, returns)
    }

    static async GetPastAssignmentByAssignmentId(assignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentAssignmentsBy('assignmentId', assignmentId, returns)
    }

    static async GetPastAssignmentByStudentAssignmentId(_studentAssignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentAssignmentsBy('_studentAssignmentId', _studentAssignmentId, returns)
    }

    static async GetPastAssignmentByStudentAssignmentUuid(studentAssignmentId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentAssignmentsBy('studentAssignmentId', studentAssignmentId, returns)
    }

    private static async GetPastStudentAssignmentsBy(type: searchStdAssignment, key: any, returns: SequelizeAttributes) {
        let studentAssignments = await StudentAssignment.findAll({
            include: [{
                model: Student,
                attributes:{exclude:['teacherId','studentId']},
                include: [{
                    model:User,
                    attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                }]
            }, {
                model: Assignment,
                attributes:{exclude:['teacherId','_assignmentId']},
                include: [{
                    model: Teacher,
                    attributes:{exclude:['teacherId']},
                    include: [{
                        model:User,
                        attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                    }]
                }]
            }],
            attributes:{exclude:['_studentAssignmentId','assignmentId','studentId']},
            where: {
                [type]: key,
                endDate: {
                    [Op.lt]: moment().toDate()
                }
            },
            group: 'studentAssignmentId',
            nest: true,
            raw: true
        }) as any

        return studentAssignments

    }

    static async GetPastStudentAssignmentsCountBy(type: searchStdAssignment, key: any):Promise<number> {
        let studentAssignmentCount = await StudentAssignment.count({
            where: {
                [type]: key,
                endDate: {
                    [Op.lt]: moment().toDate()
                }
            }
        }) 
        return studentAssignmentCount 
    }



}