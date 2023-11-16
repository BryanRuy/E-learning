import axios from "axios";
import { Configurations } from "../../../configs/config-main"

export class GoogleCore {

    static async verifyAuth(data: any): Promise<any> {

        let res: any = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${data.accessToken}`)

        console.log("constants.google_client_id",Configurations.constants.google_client_id);
        console.log("res.data.issued_to",res.data.issued_to);
        
        res.data.isVerified = true
        if (Configurations.constants.google_client_id != res.data.issued_to ||
            res.data.email != data.email) res.data.isVerified = false

        return res.data
    }

    static async verifyReCaptchaToken(token: string): Promise<boolean> {
        
        let reCaptchaSecretKey =  Configurations.constants.google_recaptcha_secret_key
        let res: any = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${reCaptchaSecretKey}&response=${token}`)
        console.log("RECAPTCHA RES ==>", res.data);
        return res.data
    }

}