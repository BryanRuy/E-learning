import { EmailService } from "./email-service";
import Configuration from '../../../configs';

export class Email{
    private static NoReplyMailer: EmailService
    private static InfoMailer: EmailService

    static getInstance(type: 'NoReply' | 'Info'): EmailService{
        switch(type){
            case 'NoReply':
                return this.initNoReplyMailer();
            case 'Info':
                return this.initInfoMailer();
        }
    }

    private static initNoReplyMailer(): EmailService{
        return !this.NoReplyMailer
        ? new EmailService(Configuration!.GmailServiceConfiguration)
        : this.NoReplyMailer
    }

    private static initInfoMailer(): EmailService{
        return !this.InfoMailer
        ? new EmailService(Configuration!.EmailServerConfigurations as any)
        : this.InfoMailer
    }


}