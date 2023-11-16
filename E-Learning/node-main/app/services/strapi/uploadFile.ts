import { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import { strapi, StrapiCore } from "./strapi-core";

export class UploadFile {

    static async GetFile(id: number): Promise<any> {

        let token = await StrapiCore.AuthToken()
        let blogs = await strapi.getFile(id, token)
        return blogs

    }

    static async UploadFile(form: FormData): Promise<any> {

        let token = await StrapiCore.AuthToken()
        let headers = form.getHeaders();
        headers['Authorization'] = token;
        let requestConfig: AxiosRequestConfig = { headers }

        let uploadedFile = await strapi.upload(form, requestConfig)
        return uploadedFile

    }

}