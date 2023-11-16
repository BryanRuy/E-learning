import { options } from "joi"
import _ from "lodash"
import moment from "moment"
import { Sequelize } from "sequelize-typescript"
import { Option, Question, StudentTest, Test, op as Op, sequelize, User, Student } from "../../../sequelize"
import { a } from "../../../sequelize/locales"
import { SequelizeAttributes } from "../../../sequelize/types"
import { NotFoundError } from "../../../sequelize/utils/errors"
import { TestCore } from "../test"

export type testSearchBy = '_studentTestId' | 'studentTestId' | 'testId' | 'studentId'
export interface studentTestArgs {
    type?: any
    key: any
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean
    limit?:number
    offset?:number
}

export class StudentTestCore {

    private static setDefaultArgs(args: studentTestArgs) {
        const _args = _.clone(args)

        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        _args.limit = _args.limit ?? 20
        _args.offset = _args.offset ?? 0
        return _args
    }

    private static async GetStudentTests(_args: studentTestArgs): Promise<StudentTest[]> {

        let args = this.setDefaultArgs(_args)
        let studentTest = await StudentTest.findAllSafe(args.returns, {
            include: [{
                model: Test,
                include: [{
                    model: Question,
                    include: [Option]
                }]
            }],
            group: 'studentTestId',
            where: { [args.type]: args.key },
            raw: true,
            nest: true,
            limit:args.limit,
            offset:args.offset
        }) as any

        if (studentTest.length == 0 && args.shouldThrowNotFound)
            throw new NotFoundError(...a('No student test found.'))

        return studentTest as any
    }

    static async GetStudentTestById(args: studentTestArgs): Promise<StudentTest> {
        args.type = '_studentTestId'

        let studentTest = await this.GetStudentTests(args)
        return studentTest[0]
    }

    static async GetStudentTestByUuid(args: studentTestArgs): Promise<StudentTest> {
        args.type = 'studentTestId'
        let studentTest = await this.GetStudentTests(args)
        return studentTest[0]
    }

    static async GetStudentTestByStudentId(args: studentTestArgs): Promise<StudentTest[]> {
        args.type = 'studentId'
        return await this.GetStudentTests(args)
    }

    static async GetStudentTestsWhereIn(studentId: number, testId: any, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentTest.findAllSafe(returns, {
            include: [{
                model: Test,
                include: [{
                    model: Question,
                    include: [Option]
                }],
                where: {
                    _testId: {
                        [Op.in]: testId
                    }
                }
            }],
            group: 'studentTestId',
            where: {
                studentId: studentId
            },
            raw: true,
            nest: true
        }) as any

        return studentTest
    }

    
    static async GetUpcomingTestsByWhereInTestIds(testIds: number[], returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentTest.findAllSafe(returns, {
            include: [{
                model: Test,
                include: [{
                    model: Question,
                    include: [Option]
                }],
                where: {
                    _testId: {
                        [Op.in]: testIds
                    }
                }
            }],
            where: {
                endTime: {
                    [Op.gt]: moment() as any
                }
            },
            group: 'studentTestId',
            raw: true,
            nest: true
        }) as any

        return studentTest
    }

    static async GetPastTestsByWhereInTestIds(testIds: number[], returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<StudentTest[]> {
        let studentTest = await StudentTest.findAllSafe(returns, {
            include: [{
                model: Test,
                include: [{
                    model: Question,
                    include: [Option]
                }],
                where: {
                    _testId: {
                        [Op.in]: testIds
                    }
                }
            }],
            where: {
                endTime: {
                    [Op.lt]: moment() as any
                }
            },
            group: 'studentTestId',
            raw: true,
            nest: true
        }) as any

        return studentTest
    }

    static async UnassignStudentTest(studentTestId: number): Promise<any> {

        let unassignTest = await StudentTest.destroy({
            where: { _studentTestId: studentTestId }
        })

        return unassignTest
    }

    static async GetUpcomingTestByStudentId(studentId: number,limit:number,offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentTestBy('studentId', studentId,limit,offset, returns)
    }

    static async GetUpcomingTestByTestId(testId: number, limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentTestBy('testId', testId, limit, offset, returns)
    }

    static async GetUpcomingTestByStudentTestId(_studentTestId: number,limit:number,offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentTestBy('_studentTestId', _studentTestId, limit,offset,returns)
    }

    static async GetUpcomingTestByStudentTestUuid(studentTestId: number,limit:number,offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetUpcomingStudentTestBy('studentTestId', studentTestId,limit,offset, returns)
    }

    private static async GetUpcomingStudentTestBy(type: testSearchBy, key: any, limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        let studentTest = await StudentTest.findAll( {
            include: [{
                model: Student,
                attributes:{exclude: ['studentId','teacherId']},
                include: [{
                    model:User,
                    attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                    
                }]
            }, {
                model: Test,
                attributes:{exclude: ['_testId','questionId','teacherId']},
                include: [{
                    model: Question,
                    include: [Option]
                }]
                
            }],
            attributes:{exclude: ['_studentTestId','studentId','testId']},
           
            where: {
                [type]: key,
                endTime: {
                    [Op.gt]: moment()
                } as any
            },
            group: 'studentTestId',
            subQuery:false,
            limit:limit,
            offset:offset,
            nest: true,
            raw: true
        })

        return studentTest as any
    }


    static async GetPastTestByStudentId(studentId: number,limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentTestBy('studentId', studentId, limit, offset ,returns)
    }

    static async GetPastTestByTestId(testId: number,limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentTestBy('testId', testId, limit, offset ,returns)
    }

    static async GetPastTestByStudentTestId(_studentTestId: number,limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentTestBy('_studentTestId', _studentTestId,limit, offset , returns)
    }

    static async GetPastTestByStudentTestUuid(studentTestId: number, limit:number, offset:number,returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return this.GetPastStudentTestBy('studentTestId', studentTestId, limit, offset ,returns)
    }


    private static async GetPastStudentTestBy(type: testSearchBy, key: any, limit:number, offset:number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        let studentTest = await StudentTest.findAllSafe(returns, {
            include: [{
                model: Student,
                attributes:{exclude: ['studentId','teacherId']},
                include: [{
                    model:User,
                    attributes:['userId','name','profilepicture','about','roleId','email','createdAt'],
                }]
            }, {
                model: Test,
                attributes:{exclude: ['_testId','questionId','teacherId']},
                include: [{
                    model: Question,
                    include: [Option]
                }]
            }],
            attributes:{exclude: ['_studentTestId','studentId','testId']},
            where: {
                [type]: key,
                endTime: {
                    [Op.lt]: moment()
                } as any

            },
         
            group: 'studentTestId',
            subQuery:false,
            limit:limit,
            offset:offset,
            nest: true,
            raw: true
        })

        

        return studentTest
    }

    static async getTotalRowsOfStudentPastTest(type:testSearchBy, key:any):Promise<number>{
        let count = await StudentTest.count({
            where:{
                [type]: key,
                endTime: {
                    [Op.lt]: moment()
                } as any}
        }) as any
        return count
    }

    static async getTotalRowsOfStudentUpcomingTest(type:testSearchBy, key:any):Promise<number>{
        let count = await StudentTest.count({
            where:{
                [type]: key,
                endTime: {
                    [Op.gt]: moment()
                } as any}
        }) as any
        return count
    }



}