import { strapi, StrapiCore } from "./strapi-core";

export class CategoryUtils {
    static async GetCategories(): Promise<any> {

        let token = await StrapiCore.AuthToken()
        let blogs = await strapi.getCategories(token)
        return blogs

    }
}