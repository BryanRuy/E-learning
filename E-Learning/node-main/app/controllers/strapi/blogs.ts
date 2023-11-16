import { Request, Response, NextFunction } from "express";
import FormData from "form-data";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { BlogsUtil, UploadFile } from "../../services/strapi";
import { UserFactory } from "../../services/user/user-factory";
import { CheckQueryPagingParams } from "../../utility";

export async function GetBlogs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const queryParams = CheckQueryPagingParams(req.query);

    let blogs = await BlogsUtil.GetBlogs(queryParams.limit, queryParams.offset);

    blogs.forEach(async (b: any, index: number) => {
      delete b.noNameUser.noNameUserId;
      delete b.noNameUser.id;
      delete b.comments;
    });

    DataResponse(res, 200, blogs);
  } catch (err) {
    next(err);
  }
}

export async function PostBlog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;

    let data = req.body;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (role == "student")
      throw new BadRequestError(
        ...a("You are not authorized to post a lesson")
      );

    let mainImage;
    if (Array.isArray(req.files)) {
      for (let file of req.files) {
        const form = new FormData();
        form.append("files", file.buffer, file.originalname);
        mainImage = await UploadFile.UploadFile(form);
      }
    }

    let userCore = UserFactory("teacher");
    let teacher = await userCore.GetUserByUuid({
      key: data.teacherId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    });

    data.MainImage = mainImage ? mainImage[0].id : undefined;
    let blogs = await BlogsUtil.PostBlogs(data, teacher?._userId!);
    DataResponse(res, 200, blogs);
  } catch (err) {
    next(err);
  }
}

export async function GetBlog(req: Request, res: Response, next: NextFunction) {
  try {
    let blogId = req.params?.blogId as any;

    if (!blogId) throw new BadRequestError(...a("Please select a valid blog"));

    let blog = await BlogsUtil.GetBlog(blogId!);

    delete blog.noNameUser.noNameUserId;
    delete blog.noNameUser.id;
    delete blog.comments;

    DataResponse(res, 200, blog);
  } catch (err) {
    next(err);
  }
}
