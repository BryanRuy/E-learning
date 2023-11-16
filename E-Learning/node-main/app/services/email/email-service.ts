
import { Configurations } from "../../../configs/config-main";
import _ from "lodash";
import nodemailer, { Transporter } from 'nodemailer'
import { Logger } from "../../../sequelize/utils/logger";

const EmailConfig = Configurations.GmailServiceConfiguration

export class EmailService {
    transporter: Transporter;
    emailAddress?: string;

    constructor(config: typeof EmailConfig) {        
        this.emailAddress = config.auth.user;
        this.transporter = nodemailer.createTransport(config as any);
        this.transporter.verify(function (error: any, success: any) {
            if (error) {
                console.log("CHECK MAIL ERROR ==>", error);
            } else {
                Logger.success("SERVER IS READY TO SEND EMAILS")
            }
        });
    }


    async sendEmail(sendTo: string, subject: string, html: string) {
        
        if (this.transporter) {
            try {
                // send mail with defined transport object
                let info = await this.transporter.sendMail({
                    from: this.emailAddress,
                    to: sendTo,
                    subject: subject || '',
                    html: html || ''
                });
                
                if (_.has(info, 'accepted'))
                    Logger.success("Email sent")
                else
                    Logger.error("Email couldn't sent")
            }
            catch (e) {
                Logger.info('Failed to send email')
                console.log(e);
            }
        } else {
            Logger.info('--- EMAIL TRANSPORTER NOT READY ---')
        }
    }





}


