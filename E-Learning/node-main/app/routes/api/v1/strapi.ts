"use strict";

import express, { NextFunction, Request, Response } from "express";
import { AuthorizeUtil } from "../../../../sequelize/middlewares/auth/auth";
import {
  BlogCtrl,
  CategoryCtrl,
  CommentCtrl,
  noNameUserCtrl,
  LessonCtrl,
  TopicCtrl,
  StudentLessonCtrl,
  FileCtrl,
  ContentCtrl,
} from "../../../controllers/strapi";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get(
  `/writers`,
  AuthorizeUtil.AuthorizeAdmin,
  noNameUserCtrl.GetnoNameUsers
);
router.get(
  `/writers/:noNameUserId`,
  AuthorizeUtil.AuthorizeAdmin,
  noNameUserCtrl.GetnoNameUserById
);

router.get(`/blogs`, BlogCtrl.GetBlogs);
router.get(`/blogs/:blogId`, BlogCtrl.GetBlog);
// router.post(`/blogs`, AuthorizeUtil.AuthorizeUser, upload.any(), BlogCtrl.PostBlog)

router.get(`/blogs/:blogId/comments`, CommentCtrl.GetBlogComments);
router.post(`/comments`, AuthorizeUtil.AuthorizeUser, CommentCtrl.PostComment);

router.get(`/categories`, CategoryCtrl.GetCategories);
router.get(`/content/:slug`, ContentCtrl.GetContentBySlug);

router.post(
  `/topics`,
  AuthorizeUtil.AuthorizeUser,
  upload.single("file"),
  TopicCtrl.PostTopic
);
router.put(
  `/topics`,
  AuthorizeUtil.AuthorizeUser,
  upload.single("file"),
  TopicCtrl.UpdateTopic
);
router.get(`/topics`, AuthorizeUtil.AuthorizeUser, TopicCtrl.GetTopics);
router.delete(
  `/topics/:topicId`,
  AuthorizeUtil.AuthorizeUser,
  TopicCtrl.DeleteTopic
);

router.post(`/lessons`, AuthorizeUtil.AuthorizeUser, LessonCtrl.PostLesson);
router.put(`/lessons`, AuthorizeUtil.AuthorizeUser, LessonCtrl.UpdateLesson);
router.get(
  `/lessons/:lessonId`,
  AuthorizeUtil.AuthorizeUser,
  LessonCtrl.GetLesson
);
router.delete(
  `/lessons/:lessonId`,
  AuthorizeUtil.AuthorizeUser,
  LessonCtrl.DeleteLessonById
);
router.get(
  `/recent-lessons`,
  AuthorizeUtil.AuthorizeUser,
  LessonCtrl.GetRecentLessons
);
router.get(
  `/topics/:topicId/lessons`,
  AuthorizeUtil.AuthorizeUser,
  LessonCtrl.GetTopicLessons
);
router.get(
  `/lessons`,
  AuthorizeUtil.AuthorizeStudent,
  LessonCtrl.GetStudentLessonsCount
);

router.post(
  `/student-lessons`,
  AuthorizeUtil.AuthorizeUser,
  StudentLessonCtrl.AssignLessonToStudent
);
router.put(
  `/student-lessons`,
  AuthorizeUtil.AuthorizeUser,
  StudentLessonCtrl.UpdateLessonOfStudent
);
router.delete(
  `/student-lessons`,
  AuthorizeUtil.AuthorizeUser,
  StudentLessonCtrl.UnassignLessonToStudent
);

router.post(
  `/uploads`,
  AuthorizeUtil.AuthorizeUser,
  upload.single("file"),
  FileCtrl.UploadImageFile
);
export default router;
