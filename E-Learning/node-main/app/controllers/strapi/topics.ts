import { NextFunction, Request, Response } from "express";
import FormData from "form-data";
import { a } from "../../../sequelize/locales";
import { BadRequestError, NotFoundError, UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { TopicUtil, UploadFile } from "../../services/strapi";

export async function GetTopics(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        let topic = await TopicUtil.GetTopics(_userId, role!)
        topic.forEach((t: any) => {
            delete t.lessons
        });
        DataResponse(res, 200, topic)

    } catch (err) {
        next(err)
    }
}

export async function PostTopic(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let data = req.body

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (role == 'student')
            throw new BadRequestError(...a("You are not authorized to post a topic"))


        if (!req.file)
            throw new BadRequestError(...a("Please select an image"))

        let mainImage;
        if (req.file) {
            const form = new FormData();
            form.append('files', req.file.buffer, req.file.originalname)
            mainImage = await UploadFile.UploadFile(form)
        }

        data.image = mainImage ? mainImage[0].id : undefined
        let topic = await TopicUtil.PostTopic(data, _userId)
        DataResponse(res, 200, topic)

    } catch (err) {
        next(err)
    }
}

export async function DeleteTopic(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let topicId = req.params?.topicId as any

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (role === 'student')
            throw new BadRequestError(...a("You are not authorized to access this resource"))

        let topic = await TopicUtil.GetTopicById(topicId, true)

        if (!topic && topic.length == 0)
            throw new NotFoundError(...a('No topic found'))

        let topicRes = await TopicUtil.DeleteTopicById(topic[0])

        topic = await TopicUtil.GetTopics(_userId, role!)
        topic.forEach((t: any) => {
            delete t.lessons
        });

        DataResponse(res, 200, topicRes)

    } catch (err) {
        next(err)
    }
}

export async function UpdateTopic(req: Request, res: Response, next: NextFunction) {
    try {
        let _userId = req.CurrentUser?._userId
        let role = req.CurrentUser?.roleId
        let data = req.body

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (role == 'student')
            throw new BadRequestError(...a("You are not authorized to update a topic"))

        let topicDb = await TopicUtil.GetTopicById(data.id, true)

        let mainImage;
        if (req.file) {
            const form = new FormData();
            form.append('files', req.file.buffer, req.file.originalname)
            mainImage = await UploadFile.UploadFile(form)
        }

        data.image = mainImage ? mainImage[0].id : data.image
        let topic = await TopicUtil.UpdateTopic(data)
        DataResponse(res, 200, topic)

    } catch (err) {
        next(err)
    }
}
