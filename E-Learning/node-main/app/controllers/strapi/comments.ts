import { NextFunction, Request, Response } from "express"
import { a } from "../../../sequelize/locales"
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors"
import { DataResponse } from "../../../sequelize/utils/http-response"
import { CommentsUtil } from "../../services/strapi"

export async function PostComment(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let data = req.body

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        data.userId = _userId
        data.blogs = data.blogId

        let comment = await CommentsUtil.PostComment(data)
        comment.blogId = comment.blogs.id
        delete comment.blogs
        DataResponse(res, 200, comment)

    } catch (err) {
        next(err)
    }
}

export async function GetBlogComments(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let blogId = req.params?.blogId as any

        // if (!_userId)
        //     throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!blogId)
            throw new BadRequestError(...a("Please select a valid blog"))

        let blogComments = await CommentsUtil.GetBlogComments(blogId!)
        blogComments.forEach((c: any) => {
            delete c.blogs
        });

        DataResponse(res, 200, blogComments)

    } catch (err) {
        next(err)
    }
}