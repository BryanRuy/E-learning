import { NextFunction, Response, Request } from "express";
import { a } from "../../../sequelize/locales";
import { UnAuthorizedError } from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { NewTicketSchema } from "../../../sequelize/validation-schema/NewTicketSchema";
import { OsTicketCore } from "../../services/osticket";

export async function CreateOSTicket(req: Request, res: Response, next: NextFunction) {
    try {
        let user = req.CurrentUser
        const ticket = await NewTicketSchema.validateAsync(req.body)

        if (!user)
            throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))

        let data = {
            name: user.name,
            email: user.email,
            subject: ticket.subject,
            message: ticket.message
        }

        let createTicket = await OsTicketCore.CreateTicket(data)

        DataResponse(res, 200, createTicket)

    } catch (err) {
        
        next(err)
    }
}