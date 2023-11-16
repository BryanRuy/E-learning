
import Strapi, { Authentication } from "../../thirdparty/strapi";
import * as _ from 'lodash'
import moment from "moment";
import * as _vals from "../../../sequelize/utils/validators"
import JsonWebToken from 'jsonwebtoken'
import GlobalConfigurations from '../../../configs';
const StrapiConfigurations = GlobalConfigurations!.StrapiConfigurations;

export const strapi = new Strapi(StrapiConfigurations.strapiUrl!, undefined, {
    headers: { 'Content-Type': 'application/json' },
})

export class StrapiCore {

    static token: string = ""

    static async LoginAdmin(): Promise<Authentication> {
        let { strapiUsername, strapiPassword } = StrapiConfigurations;
        let login = (await strapi.loginAdmin(strapiUsername!, strapiPassword!) as any).data as Authentication
        this.token = login.token
        return login
    }

    static async AuthToken(): Promise<string> {
        if (this.token == "")
            await this.LoginAdmin()

        let verify = await this.VerifyJWT(this.token)

        this.token = !verify
            ? (await this.LoginAdmin()).token
            : this.token

        return 'Bearer ' + this.token
    }

    static async VerifyJWT(token: string): Promise<any> {
        return new Promise((resolve, reject) => {

            JsonWebToken.verify(token, 'be4dc2e03fa54f534f74dcbe6f0fe3be', (error: any, payload: any) => {
                if (error) {
                    return reject(false)
                }

                if (!_.has(payload, 'iat') || !_.has(payload, 'exp'))
                    return false

                const tokenExpiry = _vals.isUnixTimestamp(payload.exp)
                if (isNaN(tokenExpiry)) return false

                const currentTime = moment().utc()
                const tokenExpiryMoment = moment.unix(tokenExpiry)
                if (tokenExpiryMoment.isSameOrBefore(currentTime))
                    return false

                return resolve(true)
            })
        })
    }
}