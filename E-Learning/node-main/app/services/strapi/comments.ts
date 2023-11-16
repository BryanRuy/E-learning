import { a } from "../../../sequelize/locales";
import { BadRequestError } from "../../../sequelize/utils/errors";
import { Comment } from "../../thirdparty/strapi";
import { noNameUserUtil } from "./noNameUser";
import { strapi, StrapiCore } from "./strapi-core";

export class CommentsUtil {
  static async PostComment(comment: Comment): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let noNameUser = await noNameUserUtil.GetnoNameUserStarpi(comment.userId!);

    if (noNameUser.length < 0)
      return new BadRequestError(...a(`You cannot post comments`));
    comment.noNameUser = noNameUser[0].id;
    let commentRes = await strapi.posComment(comment, token);
    return commentRes;
  }

  static async GetBlogComments(Id: number): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let blogComments = await strapi.getBlogComments(Id, token);
    return blogComments;
  }
}
