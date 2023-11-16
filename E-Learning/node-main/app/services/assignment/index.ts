
import { Assignment, Teacher, User } from "../../../sequelize";
import { SequelizeAttributes } from "../../../sequelize/types";
import * as _ from "lodash"
import { NotFoundError } from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";

export interface AssignmentCoreParams {
    type?: any
    key: any
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean
    limit?:number
    offset?:number
}

export class AssignmentCore {

    private static setDefaultValues(args: AssignmentCoreParams) {
        const _args = _.clone(args)
        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        _args.limit = _args.limit ?? 20
        _args.offset = _args.offset ?? 0
        return _args
    }

    private static async GetAssignments(_args: AssignmentCoreParams): Promise<Assignment[]> {
        let args = this.setDefaultValues(_args)
        let assignments = await Assignment.findAllSafe(args.returns, {
            include: [{
                model: Teacher,
                include: [User]
            }],
            where: {
                [args.type]: [args.key]
            },
            limit:args.limit,
            offset:args.offset
        }) as any

        if ((!assignments || assignments.length == 0) && args.shouldThrowNotFound)
            throw new NotFoundError(...a('No Assignment found'))

        return assignments as any
    }

    static async GetAssignmentById(args: AssignmentCoreParams): Promise<Assignment> {
        args.type = '_assignmentId'
        let assignments = await this.GetAssignments(args) as any
        return assignments[0]
    }

    static async GetAssignmentByUUid(args: AssignmentCoreParams): Promise<Assignment> {
        args.type = 'assignmentId'
        let assignments = await this.GetAssignments(args) as any
        return assignments[0]

    }

    static async GetAssignmentByTeacherId(args: AssignmentCoreParams): Promise<Assignment[]> {
        args.type = 'teacherId'
        return await this.GetAssignments(args)
    }

    static async GetAssignmentCountBy(type:'teacherId',key:any):Promise<number>{
        let count = await Assignment.count({
            where: {
                [type]: [key]
            },
        }) 
        return count
    }

    static async CreateAssignment(assignment: Assignment): Promise<Assignment> {
        let newAssignment = await Assignment.create(assignment)
        let assignments = await this.GetAssignmentById({ key: newAssignment._assignmentId } as any)
        return assignments
    }

    static async UpdateAssignment(assignment: Assignment): Promise<Assignment> {
        let updateAssignment = await Assignment.update(
            { ...assignment },
            {
                where: {
                    _assignmentId: assignment._assignmentId
                }
            })

        let assignments = await this.GetAssignmentById({ key: assignment._assignmentId } as any)
        return assignments
    }

    static async DeleteAssignment(assignmentId: number): Promise<any> {

        return await Assignment.destroy({
            where: { _assignmentId: assignmentId }
        })
    }
}




