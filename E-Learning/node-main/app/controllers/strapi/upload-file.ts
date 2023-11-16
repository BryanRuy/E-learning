import { NextFunction, Request, Response } from "express"
import FormData from "form-data"
import { a } from "../../../sequelize/locales"
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors"
import { DataResponse } from "../../../sequelize/utils/http-response"
import { UploadFile } from "../../services/strapi"

export async function UploadImageFile(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!req.file)
            throw new BadRequestError(...a("Please select an image"))

        let file = req.file
        const form = new FormData();
        form.append('files', file.buffer, file.originalname)
        let uploadFile = await UploadFile.UploadFile(form)

        DataResponse(res, 200, uploadFile)

    } catch (err) {
        next(err)
    }
}