import _ from "lodash";
import { Where } from "sequelize/types/lib/utils";
import { sequelize, Student, Teacher, User } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { StudentTeacherHistory } from "../../../sequelize/models/StudentTeacherHistory";
import { SequelizeAttributes } from "../../../sequelize/types";
import { NotFoundError } from "../../../sequelize/utils/errors";

export interface studentTeacherHistoryArgs {
    type?:any
    key:any
    returns? : SequelizeAttributes
    shouldThrowNotFound?: boolean
    limit:number,
    offset:number
}

let Seq = sequelize.Sequelize

export class StudentTeachertHistoryCore {
    private static  setDefaultValues(_args:studentTeacherHistoryArgs) : studentTeacherHistoryArgs {
        let args = _.clone(_args)
        args.returns =  args.returns ?? SequelizeAttributes.WithoutIndexes
        args.shouldThrowNotFound = args.shouldThrowNotFound ?? false

        return args
        
    }

    private static async GetStudentTeacherHistory(_args : studentTeacherHistoryArgs): Promise<any[]>{
        let args = this.setDefaultValues(_args)
        args.returns = SequelizeAttributes.WithIndexes
        let history = await  StudentTeacherHistory.findAndCountAllSafe(args.returns ,{
            include:[{
                model:Student,
                include:[User]
            },{
                model:Teacher,
                include:[User] 
            }],
       
            where :{
                [args.type] : args.key
            },
            limit:args.limit,
            offset: args.offset
        }) as any

        if(history.length == 0 && args.shouldThrowNotFound)
            throw new NotFoundError("No teacher student assign history");

        return history
    }

    static async GetStudentTeacherHistoryById(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory>{
        args.type = '_studentTeacherHistoryId'
        let history = await this.GetStudentTeacherHistory(args) as any
        return history.rows[0]
    }

    static async GetStudentTeacherHistoryByUuid(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory>{
        args.type = 'studentTeacherHistoryId'
        let history = await this.GetStudentTeacherHistory(args) as any
        return  history.rows[0]
    }

    static async GetStudentTeacherHistoryByStudentId(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory[]>{
        args.type = 'studentId'
        return await this.GetStudentTeacherHistory(args) as any
    }

    static async GetStudentTeacherHistoryByTeacherId(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory[]>{
        args.type = 'teacherId'
        return await this.GetStudentTeacherHistory(args) as any
    }

    private static async GetDistinctStudentTeacherHistory(_args : studentTeacherHistoryArgs): Promise<any[]>{
        let args = this.setDefaultValues(_args)

        let history = await  StudentTeacherHistory.findAllSafe(args.returns,{
            include:[{
                model:Student,
                include:[User]
            },{
                model:Teacher,
                include:[User],
               
            }],
            where :{
                [args.type] : args.key
            },
            limit:args.limit,
            offset: args.offset
        }) as any

        if(history.length == 0 && args.shouldThrowNotFound)
            throw new NotFoundError(...a("No teacher student assign history"));

        return history
    }

    static async GetDistinctStudentTeacherHistoryByStudentId(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory[]>{
        args.type = 'studentId'
        return await this.GetDistinctStudentTeacherHistory(args) as any
    }

    static async GetDistinctStudentTeacherHistoryByTeacherId(args:studentTeacherHistoryArgs):Promise<StudentTeacherHistory[]>{
        args.type = 'teacherId'
        return await this.GetDistinctStudentTeacherHistory(args) as any
    }

}