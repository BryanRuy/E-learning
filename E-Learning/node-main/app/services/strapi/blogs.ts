import { Article } from "../../thirdparty/strapi";
import { noNameUserUtil } from "./noNameUser";
import { strapi, StrapiCore } from "./strapi-core";

export class BlogsUtil {
  static async PostBlogs(article: Article, teacherId: number): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let noNameUser = await noNameUserUtil.GetnoNameUserStarpi(teacherId);
    article.noNameUser = noNameUser[0].id;

    let articleRes = await strapi.postBlog(article, token);
    return articleRes;
  }

  static async GetBlog(Id: number): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let blogs = await strapi.getBlog(Id, token);
    return blogs;
  }

  static async GetBlogs(limit: number, offset: number): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let blogs = await strapi.getBlogs(offset, limit, token);

    return blogs;
  }
}
