import { NextFunction, Request, Response } from "express"
import { a } from "../../../sequelize/locales"
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors"
import { DataResponse } from "../../../sequelize/utils/http-response"
import { ContentUtil } from "../../services/strapi/content"

export async function GetContentBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        let slug = req.params?.slug

        if (!slug)
            throw new BadRequestError(...a("You are not authorized to access this resource"))

        let content = await ContentUtil.GetContentBySlug(slug)
        DataResponse(res, 200, content)

    } catch (err) {
        next(err)
    }
}