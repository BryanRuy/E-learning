import { Document } from "../../../sequelize"
import { a } from "../../../sequelize/locales"
import { SequelizeAttributes } from "../../../sequelize/types"
import { BadRequestError } from "../../../sequelize/utils/errors"

export class DocumentUtil {

    private static async GetDocument(type: string,
        key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Document> {
        let doc: Document = await Document.findOneSafe(returns, {
            where: {
                [type]: key
            }
        })

        return doc
    }

    static async GetDocumentById(key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return await this.GetDocument('_documentId', key, returns)
    }

    static async GetDocumentByUuid(key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes) {
        return await this.GetDocument('documentId', key, returns)
    }

    static async GetDocumentByUserId(_userId: number,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Document[]> {
        let docs: Document[] = await Document.findAllSafe(returns, {
            where: {
                userId: _userId
            }
        })

        return docs
    }


    static async SaveUserDocument(document: Document): Promise<Document> {
        let documentRes = await Document.findOrCreateSafe<Document>(SequelizeAttributes.WithIndexes, {
            defaults: document,
            where: { documentPublicId: document.documentPublicId }
        })
        return await this.GetDocumentById(documentRes[0]._documentId)
    }

    static async GetUserDocuments(userId: number,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Document[]> {
        return this.GetDocuments('userId', userId, returns)
    }

    static async GetChatDocuments(chatId: string,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<Document[]> {
        return this.GetDocuments('Id', chatId, returns)
    }

    static async GetDocuments(type: string, key: any, returns: SequelizeAttributes): Promise<Document[]> {
        let doc: Document[] = await Document.findAllSafe(SequelizeAttributes.WithoutIndexes, {
            where: { [type]: key }
        })
        return doc
    }

    static async DeleteDocument(documentId: string): Promise<Document[]> {
        let document: Document = await Document.findOneSafe(SequelizeAttributes.WithIndexes, {
            where: { documentId: documentId }
        })

        if (!document)
            throw new BadRequestError(...a('No document found'))

        let doc = await Document.destroy({
            where: { _documentId: document._documentId }
        })

        return await this.GetUserDocuments(document.userId)
    }


}