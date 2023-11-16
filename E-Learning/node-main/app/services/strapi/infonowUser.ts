import { a } from "../../../sequelize/locales";
import { BadRequestError } from "../../../sequelize/utils/errors";
import { noNameUser } from "../../thirdparty/strapi";
import { StrapiCore } from "./strapi-core";
import { strapi } from "./strapi-core";

export class noNameUserUtil {
  static async CreatenoNameUser(
    noNameUserId: number,
    user: noNameUser,
    type: "student" | "teacher" | "super-admin" | "admin"
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let data = {
      noNameUserId: noNameUserId,
      noNameUserUuid: user.noNameUserUuid,
      name: user.name,
      email: user.email,
      type: type,
      profilepicture: user.profilePicture,
    };

    let noNameUser = await strapi.createnoNameUser(data, token);
    return noNameUser;
  }

  static async UpdatenoNameUser(user: noNameUser): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let noNameUser = await this.GetnoNameUserStarpi(user.noNameUserId!);
    if (noNameUser.length <= 0) {
      let createnoNameUser = await this.CreatenoNameUser(
        user.noNameUserId!,
        user,
        user.type as any
      );
      return createnoNameUser;
    } else {
      user.id = noNameUser[0].id;
      let updatenoNameUser = await strapi.updatenoNameUser(user, token);
      return updatenoNameUser;
    }
  }

  static async GetnoNameUserStarpi(noNameUserId: number): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let writer = await strapi.getnoNameUserById(noNameUserId, token);
    return writer;
  }

  static async GetnoNameUsersStarpiByIds(noNameUserId: number[]): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let users = await strapi.getnoNameUsersByIds(noNameUserId, token);
    return users;
  }

  static async GetnoNameUsersStarpi(): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let writers = await strapi.getnoNameUsers(token);
    return writers;
  }
}
