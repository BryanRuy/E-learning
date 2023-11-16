


import _ from 'lodash'
import moment from 'moment'
import { op as Op, Student, Test, User } from '../../../sequelize'
import { Attempt, ObjectiveAttempt, Option, Question, SubjectiveAttempt } from "../../../sequelize"
import { a } from '../../../sequelize/locales'
import { SequelizeAttributes } from "../../../sequelize/types"
import { NotFoundError } from '../../../sequelize/utils/errors'


export interface attemptCoreArgs {
    type?: any
    key: any
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean

}
export class AttemptCore {

    private static setDefaultValues(args: attemptCoreArgs) {
        const _args = _.clone(args)

        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        return _args
    }

    static async GetAttempt(_args: attemptCoreArgs): Promise<Attempt> {

        let args = this.setDefaultValues(_args)
        let attempt = await Attempt.findOneSafe<Attempt>(args.returns, {
            include: [{
                model: ObjectiveAttempt
            }, {
                model: SubjectiveAttempt
            }, {
                model: Student,
                include: [User]
            }, {
                model: Test,
                include: [{
                    model: Question,
                    include: [Option]
                }]

            }],
            where: {
                [args.type]: args.key
            },
        })
        if (!attempt && args.shouldThrowNotFound) {
            throw new NotFoundError(...a(`Attempt Not found`))
        }
        return attempt
    }

    static async GetAttemptById(args: attemptCoreArgs): Promise<Attempt> {
        args.type = '_attemptId'
        return await this.GetAttempt(args)

    }

    static async GetAttemptByUuid(args: attemptCoreArgs): Promise<Attempt> {
        args.type = 'attemptId'
        return await this.GetAttempt(args)
    }

    static async GetAttemptByStudentTestId(args: attemptCoreArgs): Promise<Attempt> {
        args.type = 'studentTestId'
        return await this.GetAttempt(args)
    }

    static async GetAttemptByWhereIn(type: string, key: any, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Attempt[]> {
        let attempts = await Attempt.findAllSafe<Attempt[]>(returns, {
            include: [ObjectiveAttempt, SubjectiveAttempt],
            where: {
                [type]: {
                    [Op.in]: key
                }
            }
        })
        return attempts
    }

    static async GetAttemptByStudentIdAndTestId(studentId: number, testId: number, returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Attempt[]> {
        let attempts = await Attempt.findAllSafe<Attempt[]>(returns, {
            include: [ObjectiveAttempt, SubjectiveAttempt, Test],
            where: {
                studentId: studentId,
                testId: testId
            }
        })
        return attempts
    }

    static async GetAttemptByTeacherStudentAndTestId(
        teacherId: number,
        studentId: number,
        testId: number,
        returns: SequelizeAttributes = SequelizeAttributes.WithIndexes): Promise<Attempt[]> {
        let attempts = await Attempt.findAllSafe<Attempt[]>(returns, {
            include: [{
                model: ObjectiveAttempt,
            }, {
                model: SubjectiveAttempt,
            }, {
                model: Test,
            }, {
                model: Student,
                where: {
                    studentId: studentId,
                    teacherId: teacherId
                }
            }],
            where: {
                testId: testId
            }
        })
        return attempts
    }

    static async CreateAttempt(testId: number, studentId: number, studentTestId: number): Promise<Attempt> {

        let newAttempt = await Attempt.findOrCreateSafe<Attempt>(SequelizeAttributes.WithIndexes, {
            defaults: {
                testId: testId,
                studentId: studentId,
                studentTestId: studentTestId
            } as any,
            where: { studentTestId: studentTestId },
        })

        let attemptRes = await this.GetAttemptById({ key: newAttempt[0]._attemptId })

        return attemptRes!
    }

    static async UpdateAttempt(attempt: any): Promise<Attempt> {

        let questions: any[] = attempt.questions

        let questionIds = questions.map(x => x.questionId)
        let options = questions.filter(x => x.type == 1)
        let optionIds = options.map(x => x.optionId)

        let subjectiveAttempt: SubjectiveAttempt[] = []
        let objectiveAttempt: ObjectiveAttempt[] = []

        let dbQuestion = await Question.findAll({
            where: {
                questionId: {
                    [Op.in]: questionIds
                }
            }
        })

        let dbOptions = await Option.findAll({
            where: {
                optionId: {
                    [Op.in]: optionIds
                }
            }
        })

        questions.forEach(q => {
            q.attemptId = attempt._attemptId
            let _question = dbQuestion.filter(e => e.questionId == q.questionId)
            q.questionId = _question[0]._questionId
            if (q.type == 1) {
                let _options = dbOptions.filter(e => e.optionId == q.optionId)
                q.optionId = _options[0]._optionId
                objectiveAttempt.push(q)
            }
            else {
                subjectiveAttempt.push(q)
            }
        })



        let sAttempt = await this.saveObjectiveAttempt(objectiveAttempt)
        let oAttempt = await this.saveSubjectiveAttempt(subjectiveAttempt)

        let date = moment()
        let updateAttempt = await Attempt.update({
            submittedAt: date.toDate()
        }, {
            where: {
                _attemptId: attempt._attemptId
            }
        })

        let attemptRes = await this.GetAttemptById({key:attempt._attemptId})
        return attemptRes
    }

    private static async saveObjectiveAttempt(data: ObjectiveAttempt[]): Promise<any> {
        let objectiveAttempt
        for (let attempt of data) {
            objectiveAttempt = await ObjectiveAttempt.findOrCreateSafe(SequelizeAttributes.WithIndexes, {
                defaults: {
                    attemptId: attempt.attemptId,
                    questionId: attempt.questionId,
                    optionId: attempt.optionId
                },
                where: { attemptId: attempt.attemptId }
            })
        }
        return objectiveAttempt
    }

    private static async saveSubjectiveAttempt(data: SubjectiveAttempt[]): Promise<any> {

        let subjectiveAttempt
        for (let attempt of data) {
            subjectiveAttempt = await SubjectiveAttempt.findOrCreateSafe(SequelizeAttributes.WithIndexes, {
                defaults: {
                    attemptId: attempt.attemptId,
                    questionId: attempt.questionId,
                    answerText: attempt.answerText
                },
                where: { attemptId: attempt.attemptId }
            })
        }
        return subjectiveAttempt
    }

    static async UpdateSubjectiveAttempt(data: SubjectiveAttempt[], attemptId: string): Promise<Attempt> {

        let attempt = await this.GetAttemptByUuid({
            key: attemptId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })


        for (let s of data) {
            await SubjectiveAttempt.update({
                obtainedMarks: s.obtainedMarks
            }, {
                where: {
                    attemptId: s.attemptId,
                    questionId: s.questionId
                }
            })
        }
        attempt = await this.GetAttemptById({
            key: data[0].attemptId
        })
        return attempt
    }
}