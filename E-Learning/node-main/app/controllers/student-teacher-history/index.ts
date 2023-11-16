import { Request , Response , NextFunction} from "express";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { StudentTeachertHistoryCore } from "../../services/student-teacher-history";
import { UserCore } from "../../services/user/user-core";
import { CheckQueryPagingParams } from "../../utility";


export async function GetStudentTeacherHistory(req:Request, res: Response , next: NextFunction){
    try {

        let userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let selectedUserId = req.params?.selectedUserId
        let params = CheckQueryPagingParams(req.query)

        if(!userId)
           throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        let history, user
        if(role == 'teacher' || role == 'student')
           user = await UserCore.GetUserCore('_userId',userId, SequelizeAttributes.WithIndexes, true)

        if(selectedUserId && (role == 'admin' || role == 'super-admin')){
            user = await UserCore.GetUserCore('userId',selectedUserId, SequelizeAttributes.WithIndexes, true)
            role = user.roleId
            userId = user._userId
        }

        if(role == 'student'){
            history = await StudentTeachertHistoryCore.GetStudentTeacherHistoryByStudentId({
                key:userId,
                shouldThrowNotFound:true,
                limit:params.limit,
                offset:params.offset
            }) as any
        }
        else if(role == 'teacher'){
            history = await StudentTeachertHistoryCore.GetStudentTeacherHistoryByTeacherId({
                key:userId,
                shouldThrowNotFound:true,
                limit:params.limit,
                offset:params.offset
            }) as any
        }

        let data = {
            "pages":history.count,
            "history" : history.rows
        }
        
        DataResponse(res, 200, data)



    } catch(err){
        next(err)
    }

}

