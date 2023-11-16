import { Request, Response, NextFunction } from "express";
import { LocaleDataResponse } from "../../../sequelize/utils/http-response";
import { Configurations } from "../../../configs/config-main";
import fs from "fs"
import { v4 } from 'uuid'
import { Document, User } from "../../../sequelize";
import { randomString } from "../../../sequelize/utils";
import { BadRequestError, UnAuthorizedError, ValidationError } from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { DocumentUtil } from "../../services/document";
import { Chat } from "../../../sequelize/models/Chat";
import { SequelizeAttributes } from "../../../sequelize/types";
import { ChatParticipant } from "../../../sequelize/models/ChatParticipant";
var configs = Configurations.constants

export async function SaveDocument(req: Request, res: Response, next: NextFunction) {
    try {

        const cUser = req.CurrentUser
        const _userId = cUser?._userId
        const role = cUser?.roleId
        const { chatId } = req.body

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!req.file)
            throw new UnAuthorizedError(...a("Select a file first"))

        if (chatId) {
            let isChatParticipant = await isUserChatParticipant(chatId, cUser!)
        }
        let file = req.file
        let totalMemory = req.CurrentUser?.storage  || 104857600
        let memoryUsed = 0
        let documents = await DocumentUtil.GetDocumentByUserId(_userId)
        documents.forEach((d:Document) => {
            memoryUsed = memoryUsed+d.fileSize
        });
        
        if(totalMemory < memoryUsed+file.size && 
            (role == 'student' || role == 'teacher'))
            throw new BadRequestError(...a(`You memory limit exceeded`))

        
        let fileExts = file.originalname.split(".")
        let ext = fileExts[fileExts.length - 1];
        let fileName = `${v4()}.${ext}`

        fs.writeFileSync(`${configs.documents}/${fileName}`, file.buffer);

        const params: Document = {
            fileType: ext,
            name: `/documents/${fileName}`,
            userId: _userId,
            fileName: file.originalname,
            documentPublicId: randomString(100),
            fileSize: file.size
        } as any

        if (chatId) {
            params['Id'] = chatId
            params['tag'] = "Chat"
        }

        const documentRes = await DocumentUtil.SaveUserDocument(params)

        return LocaleDataResponse(res, 200, documentRes)

    } catch (err) {
        next(err)
    }
}

export async function GetUserDocuments(req: Request, res: Response, next: NextFunction) {
    try {

        const cUser = req.CurrentUser
        const _userId = req.CurrentUser?._userId
        const chatId = req.query?.chatId as string

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        let documents

        if (chatId) {
            let isChatParticipant = await isUserChatParticipant(chatId, cUser!)
            documents = await DocumentUtil.GetChatDocuments(chatId)
        }
        else {
            documents = await DocumentUtil.GetUserDocuments(_userId)
        }

        return LocaleDataResponse(res, 200, documents)

    } catch (err) {
        next(err)
    }
}

export async function DeleteDocument(req: Request, res: Response, next: NextFunction) {
    try {

        const _userId = req.CurrentUser?._userId
        const documentId = req.params?.documentId

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        const documents = await DocumentUtil.DeleteDocument(documentId)

        return LocaleDataResponse(res, 200, documents)

    } catch (err) {
        next(err)
    }
}

async function isUserChatParticipant(chatId: string, cUser: User) {
    let chat = await Chat.findOneSafe<Chat>(SequelizeAttributes.WithIndexes, {
        include: [
            User,
            {
                model: ChatParticipant,
                include: [User],
            },
        ],
        where: { 'chatId': chatId },
    });
    let user = chat.chatParticipants.find(
        (x) => x.user.userId === cUser?.userId
    );

    if (!user) {
        throw new ValidationError(...a("Invalid participant"));
    }

    if (user.blockedAt) {
        throw new ValidationError(...a("User is Blocked"));
    }
}