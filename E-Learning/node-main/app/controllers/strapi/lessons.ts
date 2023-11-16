import { NextFunction, Request, Response } from "express";
import { a } from "../../../sequelize/locales";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { LessonsUtil, TopicUtil } from "../../services/strapi";
import { StudentLessonsUtil } from "../../services/strapi/student-lesson";
import { Lesson } from "../../thirdparty/strapi";

export async function GetTopicLessons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    let topicId = req.params.topicId as any;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!topicId)
      throw new BadRequestError(...a("Please select a valid topic"));

    let lessons;
    if (role == "student")
      lessons = await LessonsUtil.GetStudentTopicLessons(
        _userId,
        topicId,
        role!
      );
    else lessons = await LessonsUtil.GetTeacherTopicLessons(topicId);

    lessons.forEach((e: any) => {
      delete e.content;
    });

    DataResponse(res, 200, lessons);
  } catch (err) {
    next(err);
  }
}

export async function PostLesson(
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

    let lesson: Lesson = { ...data };
    let lessonRes = await LessonsUtil.PostLesson(lesson);
    DataResponse(res, 200, lessonRes);
  } catch (err) {
    next(err);
  }
}

export async function GetLesson(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    let lessonId = req.params.lessonId as any;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!lessonId)
      throw new BadRequestError(...a("Please select a valid lesson"));

    let lesson = await LessonsUtil.GetLessonById(lessonId, true);

    if (!lesson || lesson.length <= 0)
      DataResponse(res, 200, "No lesson found");

    let studentLessonIds = new Set();
    lesson[0].studentLessons.forEach((e: any) => {
      studentLessonIds.add(e.id);
    });

    lesson[0].studentLessons = [];
    if (studentLessonIds.size > 0) {
      let studentLessons: any[] =
        await StudentLessonsUtil.GetStudentLessonsByIds(
          Array.from(studentLessonIds.values())
        );

      if (role == "student")
        studentLessons = studentLessons.filter(
          (stdLessons) => stdLessons.noNameUser.noNameUserId === _userId
        );

      studentLessons.forEach((e: any) => {
        delete e.noNameUser.id;
        delete e.noNameUser.noNameUserId;
        delete e.lesson;
      });

      delete lesson[0].studentLessons;
      lesson[0].studentLessons = studentLessons;
    }

    DataResponse(res, 200, lesson[0]);
  } catch (err) {
    next(err);
  }
}

export async function GetRecentLessons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;

    if (!userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let lessons: any;
    if (role == "student") {
      lessons = await LessonsUtil.GetStudentRecentLessons(userId);
    }

    if (role == "teacher") {
      let topics = await TopicUtil.GetTopics(userId, role!);
      let topicIds: any[] = topics.map((topic: any) => topic.id);
      if (topicIds.length === 0) lessons = [];
      else lessons = await LessonsUtil.GetAllLessonsByTopics(topicIds);
    }

    let recentLessons: any[] = [];
    lessons.sort(
      (a: any, b: any) =>
        new Date(b.created_at).getDate() - new Date(a.created_at).getDate()
    );
    lessons.forEach((e: any, index: number) => {
      delete e.content;
      if (role == "teacher") {
        let count = e.studentLessons.length;
        lessons[index].assignToStudents = count;
      }
      delete e.studentLessons;
    });

    if (lessons.length > 5) {
      for (let indx = 0; indx < 5; indx++) {
        recentLessons.push(lessons[indx]);
      }
    } else recentLessons = lessons;
    DataResponse(res, 200, recentLessons);
  } catch (err) {
    next(err);
  }
}

export async function DeleteLessonById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    let lessonId = req.params.lessonId as any;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!lessonId) throw new BadRequestError(...a("Please select a lesson"));

    let lesson = await LessonsUtil.GetLessonById(lessonId, true);

    if (lesson.length == 0) throw new NotFoundError("No lesson found");

    let lessonRes = await LessonsUtil.DeleteLessonById(lesson[0]);

    lesson = await LessonsUtil.GetAllLessonsByTopics([lesson[0].topic.id]);

    DataResponse(res, 200, lesson);
  } catch (err) {
    next(err);
  }
}

export async function UpdateLesson(
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

    let lesson: Lesson = { ...data };

    let lessonDb = await LessonsUtil.GetLessonById(lesson.id!, true);

    let lessonRes = await LessonsUtil.UpdateLesson(lesson);
    DataResponse(res, 200, lessonRes);
  } catch (err) {
    next(err);
  }
}

export async function GetStudentLessonsCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let isCompleted = req.query.isCompleted as any;
    let userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;

    if (!userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!isCompleted)
      throw new BadRequestError(...a("Please select a valid lesson type"));

    let lessonsCount = await LessonsUtil.GetStudentLessonCount(
      userId,
      isCompleted!
    );

    DataResponse(res, 200, lessonsCount);
  } catch (err) {
    next(err);
  }
}
