import { strapi, StrapiCore } from "./strapi-core";


export class ContentUtil {

    static async GetContentBySlug(slug:any):Promise<any>{
        let token = await StrapiCore.AuthToken()
        let content = await strapi.getContentBySlug(slug,token)
        return content.length > 0 ? content[0] : []
    }
}