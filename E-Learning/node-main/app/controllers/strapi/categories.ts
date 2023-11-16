import { NextFunction, Request, Response } from "express"
import { a } from "../../../sequelize/locales"
import { UnAuthorizedError } from "../../../sequelize/utils/errors"
import { DataResponse } from "../../../sequelize/utils/http-response"
import { CategoryUtils } from "../../services/strapi"

export async function GetCategories(req: Request, res: Response, next: NextFunction) {
    try {
        let categories = await CategoryUtils.GetCategories()
        DataResponse(res, 200, categories)

    } catch (err) {
        next(err)
    }
}