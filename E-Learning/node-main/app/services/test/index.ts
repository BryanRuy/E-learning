


import { sequelize, Test, Option, Question, StudentTest, op as Op } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";
import { NotFoundError } from "../../../sequelize/utils/errors";

export class TestCore {

    static async GetTest(type: string, key: any, returns: SequelizeAttributes, shouldThrowNotFound: boolean): Promise<Test> {
        let test = await Test.findOneSafe<Test>(returns, {
            include: [{
                model: Question,
                include: [Option]
            }],
            where: {
                [type]: key
            }
        })
        if (!test && shouldThrowNotFound)
            throw new NotFoundError(...a(`Test not found`))

        return test
    }

    static async GetTestWhereIn(type: string, key: any, returns: SequelizeAttributes, shouldThrowNotFound: boolean): Promise<Test[]> {

        let test = await Test.findAllSafe<Test[]>(returns, {
            include: [{
                model: Question,
                include: [Option]
            }],
            where: {
                [type]: {
                    [Op.in]: key
                }
            }
        })
        if (!test && shouldThrowNotFound)
            throw new NotFoundError(...a(`Test not found`))

        return test
    }

    static async GetTests(limit:number,offset:number,returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Test[]> {
        let tests = await Test.findAllSafe<Test[]>(returns, {
            include: [{
                model: Question,
                include: [Option]
            }],
            limit:limit,
            offset:offset
        })
        return tests
    }

    static async GetTestsCount(): Promise<number> {
        let testsCount = await Test.count()
        return testsCount
    }

    static async GetTestById(key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes,
        shouldThrowNotFound: boolean = false): Promise<Test> {
        return await this.GetTest('_testId', key, returns, shouldThrowNotFound)
    }

    static async GetTestByUuid(key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes,
        shouldThrowNotFound: boolean = false): Promise<Test> {
        return await this.GetTest('testId', key, returns, shouldThrowNotFound)
    }

    static async CreateTest(test: Test): Promise<Test> {

        let newTest = await Test.create<Test>(test, {
            include: [{
                model: Question,
                include: [Option]
            }]
        } as any)

        test = await this.GetTestById(newTest._testId)

        return test!

    }

    static async GetTestByTeacherId(teacherId: number, limit:number, offset:number ,returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Test[]> {
        let tests = await Test.findAllSafe<Test[]>(returns, {
            include: [{
                model: Question,
                include: [Option]
            }],
            where: {
                teacherId: teacherId
            },
            limit:limit,
            offset:offset
        })

        return tests
    }

    static async GetTestsCountBy(type:'teacherId' , key: any): Promise<number> {
        let testsCount = await Test.count({
            where:{
                [type]:key
            }
        })
        return testsCount
    }

    static async UpdateTest(test: Test): Promise<Test> {
        const transaction = await sequelize.transaction()
        try {
            let testDb = await this.GetTestByUuid(test.testId,
                SequelizeAttributes.WithIndexes,
                true)

            let questionIds = test.questions?.map(x => x.questionId)

            let DbQuestions = await this.GetQuestionsByUuidWhereIn(questionIds!,
                SequelizeAttributes.WithIndexes)

            let testRes = await Test.update({
                ...test
            }, {
                where: { _testId: testDb._testId },
                transaction
            })

            for (let q of test.questions!) {
                let questionRes = await Question.update(
                    { ...q }, {
                    where: {
                        testId: testDb._testId,
                        questionId: q.questionId
                    },
                    transaction
                })

                let questionId = DbQuestions.filter(e => e.questionId == q.questionId)[0]._questionId

                for (let op of q.options) {
                    let optionsRes = await Option.update({
                        optionText: op.optionText,
                        isRight: op.isRight
                    }, {
                        where: {
                            questionId: questionId,
                            optionId: op.optionId
                        },
                        transaction
                    })
                }

            }

            transaction.commit()

            return await this.GetTestById(testDb._testId,
                SequelizeAttributes.WithoutIndexes,
                true)
        }
        catch (err) {
            transaction.rollback()
            throw err
        }
    }

    static async GetQuestionsByUuidWhereIn(Ids: any[],
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Question[]> {
        let question: Question = await Question.findAllSafe(returns, {
            where: {
                questionId: {
                    [Op.in]: Ids
                }

            }
        })
        return question as any
    }



}