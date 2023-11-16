
import { Attempt, User } from "../../../sequelize";
import { SequelizeAttributes } from "../../../sequelize/types";
import { AttemptCore } from "../../services/attempt";
import { TestCore } from "../../services/test";

export class AttemptHelperCtrl {

    static async GetAttemptOfTeacherStudent(attempts: Attempt[], CurrentUser: User) {

        let testIds = new Set();
        attempts.forEach(a => testIds.add(a.testId))

        let Ids = Array.from(testIds.values())
        let tests = await TestCore.GetTestWhereIn('testId', Ids, SequelizeAttributes.WithIndexes, false)
        let mapTestIds = new Set();

        tests.filter(t => t.teacherId == CurrentUser?._userId)
            .forEach(t => mapTestIds.add(t._testId))
        let mapIds = Array.from(mapTestIds.values())

        attempts = await AttemptCore.GetAttemptByWhereIn('testId', mapIds, SequelizeAttributes.WithoutIndexes)
        return attempts

    }

}

