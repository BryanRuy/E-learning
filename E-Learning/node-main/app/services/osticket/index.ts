

import axios from "axios";
import { ApplicationError } from "../../../sequelize/utils/errors";
import { NewTicketSchemaType } from '../../../sequelize/validation-schema'
import Configurations from "../../../configs"
const { OSTicketConfigurations } = Configurations!



export class OsTicketCore {

    static async CreateTicket(data: NewTicketSchemaType): Promise<any> {

        let { name, email, subject, message } = data;
        let { ip, apiKey, newTicketUrl } = OSTicketConfigurations
        
        var postData = {
            "alert": true,
            "autorespond": true,
            "source": "API",
            "ip": ip,
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
        }

        let res: any = await axios.post(
            newTicketUrl!,
            postData, {
            headers: { 'X-API-Key': apiKey },
            method: 'POST'
        })
        
        if (res.data) {
            return {
                ticketId: res.data,
                name,
                email,
                subject,
                message,
            }
        }
        throw new ApplicationError("Unknown error occoured while creating Support Ticket")
    }
}