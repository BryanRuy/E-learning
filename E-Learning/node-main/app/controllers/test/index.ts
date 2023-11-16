import { NextFunction, Request, Response } from "express";
import { a } from "../../../sequelize/locales";
import { RoleTypeEnum, SequelizeAttributes } from "../../../sequelize/types";
import { ApplicationError, BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { AssignTestSchema, TestSchema, UpdateTestSchema } from "../../../sequelize/validation-schema";
import { AssignUtil } from "../../services/assign";
import { TestCore } from "../../services/test";
import { UserFactory } from "../../services/user/user-factory";
import _ from 'lodash';
import { StudentTestCore } from "../../services/studentTest";
import fs from 'fs';
import { v4 } from "uuid";
import { Configurations } from '../../../configs/config-main'
import { StudentTest } from "../../../sequelize";
import moment from "moment";
import { CheckQueryPagingParams } from "../../utility";

export async function CreateTest(req: Request, res: Response, next: NextFunction) {
    try {
        let test = JSON.parse(req.body.test ?? {})

        let teacherId = req.CurrentUser?._userId
        test.teacherId = teacherId

        await TestSchema.validateAsync(test);

        if (!teacherId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if ((test.questions?.length ?? 0 > 0) && Array.isArray(req.files)) {
            for (let file of (req.files as any)) {
                let fileExts = file.originalname.split(".")
                let ext = fileExts[fileExts.length - 1];
                let fileName = `${v4()}.${ext}`
                let question = Number(file.fieldname.split("-")[2]);


                if (isNaN(question)) throw new ApplicationError(...a("Unexpected file name"));
                fs.writeFileSync(`${Configurations.constants.questions}/${fileName}`, file.buffer);
                test.questions[question].image = `/questions/${fileName}`;
            }
        }

        let testRes = await TestCore.CreateTest(test)
        DataResponse(res, 200, testRes)

    } catch (err) {
        next(err)
    }

}

export async function AssignTest(req: Request, res: Response, next: NextFunction) {
    try {
        let { studentId, startTime, endTime } = req.body

        let testId = req.params.testId
        let roleId = req.CurrentUser?.roleId
        let teacherId = req.CurrentUser?._userId

        await AssignTestSchema.validateAsync({ testId, studentId, startTime, endTime })

        if (moment(endTime).isBefore(moment(startTime!)))
            throw new BadRequestError(...a('Please select a valid time period'))

        let studentCore = UserFactory('student')
        let user = await studentCore.GetUserByUuid({
            key: studentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        })

        let test = await TestCore.GetTestByUuid(testId, SequelizeAttributes.WithIndexes, true)

        if (roleId != 'teacher' ||
            user?.student?.teacher?.teacherId != teacherId ||
            test.teacherId != teacherId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let testAssign = await AssignUtil.AssignTestToStudent(test, user!, startTime, endTime)
        DataResponse(res, 200, testAssign)


    } catch (err) {
        next(err)
    }
}

export async function GetTest(req: Request, res: Response, next: NextFunction) {
    try {

        let testId = req.params.testId
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!testId)
            throw new UnAuthorizedError(...a(`Please select a test`))

        let test = await TestCore.GetTestByUuid(testId, SequelizeAttributes.WithoutIndexes, true)

        DataResponse(res, 200, test)

    } catch (err) {
        next(err)
    }
}

export async function GetTests(req: Request, res: Response, next: NextFunction) {
    try {
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let studentId = req.params?.userId
        const queryParams = CheckQueryPagingParams(req.query)

        if (!userId || !RoleTypeEnum.includes(role!))
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let tests: any[] = [] , count = 1;

        if (role === 'admin' || role === 'super-admin') {
            tests = await TestCore.GetTests(queryParams.limit, queryParams.offset)
            count = await TestCore.GetTestsCount()
        }
        
        else if (role === 'student') {
            
            tests = await StudentTestCore.GetStudentTestByStudentId({
                key: userId,
                limit: queryParams.limit,
                offset: queryParams.offset,
                returns: SequelizeAttributes.WithoutIndexes,
            }) as any

            for (let t of tests) {
                delete t._studentTestId
                delete t.testId
                delete t.test.questions
            }
        }

        else if (role === 'teacher' && studentId) {

            let studentCore = UserFactory('student')
            let student = await studentCore.GetUserByUuid({
                key: studentId,
                returns: SequelizeAttributes.WithIndexes,
                shouldThrowNotFound: true
            }) as any


            tests = await StudentTestCore.GetStudentTestByStudentId({
                key: student._userId,
                returns: SequelizeAttributes.WithIndexes,
                limit: queryParams.limit,
                offset: queryParams.offset
            }) as any
            let testIds = new Set();
            tests.filter((t: any) => t.test.teacherId == req.CurrentUser?._userId)
                .forEach((t: any) => testIds.add(t.test._testId))

            let Ids = Array.from(testIds.values())

        
            count = Ids.length
            tests = await StudentTestCore.GetStudentTestsWhereIn(student._userId, Ids, SequelizeAttributes.WithoutIndexes)
            for (let t of tests) {
                delete t._studentTestId
                delete t.testId
                delete t.test.questions
            }
        }
        else {
            count = await TestCore.GetTestsCountBy('teacherId',userId)
            tests = await TestCore.GetTestByTeacherId(userId, queryParams.limit, queryParams.offset) as any
            tests = JSON.parse(JSON.stringify(tests))
            for (let t of tests) {
                delete t.questions
            }
        }

        let data ={
            "data":tests,
            "count":count
        }

        DataResponse(res, 200, data)

    } catch (err) {
        next(err)
    }
}

export async function UpdateTest(req: Request, res: Response, next: NextFunction) {
    try {
        let test = JSON.parse(req.body.test ?? {})

        let teacherId = req.CurrentUser?._userId
        test.teacherId = teacherId

        await UpdateTestSchema.validateAsync(test);

        if (!teacherId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if ((test.questions?.length ?? 0 > 0) && Array.isArray(req.files)) {
            for (let file of (req.files as any)) {
                let fileExts = file.originalname.split(".")
                let ext = fileExts[fileExts.length - 1];
                let fileName = `${v4()}.${ext}`
                let question = Number(file.fieldname.split("-")[2]);
                if (isNaN(question)) throw new ApplicationError("Unexpected file name");

                fs.writeFileSync(`${Configurations.constants.questions}/${fileName}`, file.buffer);

                if (test.questions[question].image) {
                    let deleteFile = test.questions[question].image.split("/")
                    //TODO: - DELETE Previously saved file
                    //fs.unlinkSync(`${Configurations.constants.questions}/${deleteFile[0]}`)
                }

                test.questions[question].image = `/questions/${fileName}`;
            }
        }


        let testRes = await TestCore.UpdateTest(test)
        DataResponse(res, 200, testRes)

    } catch (err) {
        next(err)
    }

}

export async function UnassignTest(req: Request, res: Response, next: NextFunction) {
    try {

        let { studentTestId } = req.body
        let roleId = req.CurrentUser?.roleId
        let queryParams = CheckQueryPagingParams(req.query)

        if (roleId != 'teacher')
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!studentTestId)
            throw new BadRequestError(...a(`Please select a test`))

        let test = await StudentTestCore.GetStudentTestByUuid({
            key: studentTestId,
            returns: SequelizeAttributes.WithIndexes
        })

        if (!test)
            throw new BadRequestError(...a(`Selected test is not assigned to this student`))

        let unassignTest = await StudentTestCore.UnassignStudentTest(test._studentTestId)

        let tests = await StudentTestCore.GetUpcomingTestByTestId(test.testId, queryParams.limit, queryParams.offset)

        // test.forEach((t: StudentTest) => {
        //     delete t.test
        // });
        DataResponse(res, 200, tests)

    } catch (err) {
        next(err)
    }
}

export async function GetAllUpcomingTest(req: Request, res: Response, next: NextFunction) {
    try {
        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        const queryParams = CheckQueryPagingParams(req.query)

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let testRes: any, count: any = 0
        if (role === 'student') {
            testRes = await StudentTestCore.GetUpcomingTestByStudentId(userId, queryParams.limit, queryParams.offset)
            count = await StudentTestCore.getTotalRowsOfStudentUpcomingTest('studentId', userId)
        }
        else if (role === 'teacher') {
            let tests = await TestCore.GetTestByTeacherId(userId, queryParams.limit, queryParams.offset, SequelizeAttributes.WithIndexes)
            let testIds = new Set();
            tests.forEach((t: any) => testIds.add(t._testId))
            let Ids = Array.from(testIds.values()) as any
            count = Ids.length
            testRes = await StudentTestCore.GetUpcomingTestsByWhereInTestIds(Ids, SequelizeAttributes.WithoutIndexes)
        }

        testRes.forEach((stdTests: StudentTest) => {
            delete stdTests.test?.questions
        });
        let data = {
            "data": testRes,
            "count": count
        }

        DataResponse(res, 200, data)
    } catch (err) {
        next(err)
    }
}

export async function GeAllPastTest(req: Request, res: Response, next: NextFunction) {
    try {

        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        const queryParams = CheckQueryPagingParams(req.query)

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let testRes: any, count: any = 0
        if (role == 'student') {
            testRes = await StudentTestCore.GetPastTestByStudentId(userId, queryParams.limit, queryParams.offset)
            count = await StudentTestCore.getTotalRowsOfStudentPastTest('studentId', userId)
        }
        else if (role === 'teacher') {
            let tests = await TestCore.GetTestByTeacherId(userId, queryParams.limit, queryParams.offset, SequelizeAttributes.WithIndexes)
            let testIds = new Set();
            tests.forEach((t: any) => testIds.add(t._testId))
            let Ids = Array.from(testIds.values()) as any
            count = Ids.length
            testRes = await StudentTestCore.GetPastTestsByWhereInTestIds(Ids, SequelizeAttributes.WithoutIndexes)
        }

        testRes.forEach((stdTests: StudentTest) => {
            delete stdTests.test?.questions
        });

        let data = {
            "data": testRes,
            "count": count
        }

        DataResponse(res, 200, data)
    } catch (err) {
        next(err)
    }
}


export async function GetUpcomingTest(req: Request, res: Response, next: NextFunction) {
    try {


        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let testId = req.params.testId as any

        const queryParams = CheckQueryPagingParams(req.query)

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (role == 'student')
            throw new BadRequestError(...a(`You are not authorized to access this resource`))

        if (!testId)
            throw new BadRequestError(...a(`please select a test`))


        let test = await TestCore.GetTestByUuid(testId, SequelizeAttributes.WithIndexes, true)
        let testRes = await StudentTestCore.GetUpcomingTestByTestId(test._testId, queryParams.limit, queryParams.offset)

        testRes.forEach((stdTests: StudentTest) => {
            delete stdTests.test?.questions
        });

        DataResponse(res, 200, testRes)
    } catch (err) {
        next(err)
    }
}

export async function GetPastTest(req: Request, res: Response, next: NextFunction) {
    try {

        let userId = req.CurrentUser?._userId
        let testId = req.params.testId as any
        const queryParams = CheckQueryPagingParams(req.query)

        if (!userId)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        if (!testId)
            throw new BadRequestError(...a(`please select a test`))

        let test = await TestCore.GetTestByUuid(testId, SequelizeAttributes.WithIndexes, true)
        let testRes = await StudentTestCore.GetPastTestByTestId(test._testId, queryParams.limit, queryParams.offset) as any


        testRes.forEach((stdTests: StudentTest) => {
            delete stdTests.test?.questions
        });

        DataResponse(res, 200, testRes)
    } catch (err) {
        next(err)
    }
}



// export async function GetStudentUpcomingTest(req: Request, res: Response, next: NextFunction) {

//     try {
//         let userId = req.CurrentUser?._userId
//         let role = req.CurrentUser?.roleId

//         if (!userId)
//             throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

//         if (role != 'student')
//             throw new BadRequestError(...a(`You are not authorized to access this resource`))

//         let testRes = await StudentTestCore.GetUpcomingTestByStudentId(userId)

//         testRes.forEach((stdTests: StudentTest) => {
//             delete stdTests.test?.questions
//         });

//         DataResponse(res, 200, testRes)
//     }
//     catch (err) {
//         next(err);
//     }

// }

// export async function GetStudentPastTest(req: Request, res: Response, next: NextFunction) {
//     try {


//         let userId = req.CurrentUser?._userId
//         let role = req.CurrentUser?.roleId

//         if (!userId)
//             throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

//         if (role != 'student')
//             throw new BadRequestError(...a(`You are not authorized to access this resource`))


//         let testRes = await StudentTestCore.GetPastTestByStudentId(userId) as any

//         testRes.forEach((stdTests: StudentTest) => {
//             delete stdTests.test?.questions
//         });

//         DataResponse(res, 200, testRes)
//     } catch (err) {
//         next(err)
//     }
// }


