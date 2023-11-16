import { Authentication } from "../../thirdparty/strapi";
import { strapi } from "./strapi-core";
export * from "./blogs";
export * from "./categories";
export * from "./comments";
export * from "./noNameUser";
export * from "./lessons";
export * from "./topics";
export * from "./uploadFile";

export class StrapiUtils {
  static async RegisterAdmin(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<Authentication> {
    let register = await strapi.registerAdmin(
      firstname,
      lastname,
      email,
      password
    );
    return register;
  }
}
