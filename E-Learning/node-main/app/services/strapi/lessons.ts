import { RoleType } from "../../../sequelize/types";
import {
  BadRequestError,
  NotFoundError,
} from "../../../sequelize/utils/errors";
import { Lesson } from "../../thirdparty/strapi";
import { strapi, StrapiCore } from "./strapi-core";
import { StudentLessonsUtil } from "./student-lesson";
import { noNameUserUtil } from "../../services/strapi";
import { a } from "../../../sequelize/locales";

export class LessonsUtil {
  static async GetTeacherTopicLessons(topicId: number): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let lessons = await strapi.getAllLessonsOfTopic(topicId, token);

    lessons.forEach((e: any) => {
      delete e.studentLessons;
    });

    return lessons;
  }

  static async GetStudentTopicLessons(
    userId: number,
    topicId: number,
    role: RoleType
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let filterLessonsIds: number[] = [];
    let studentLessons = await StudentLessonsUtil.GetStudentLessons(userId);
    studentLessons.forEach((e: any) => {
      if (e.lesson.topic == topicId) filterLessonsIds.push(e.lesson.id);
    });

    if (filterLessonsIds.length == 0)
      throw new NotFoundError(...a(`No lesson found`));

    let lessons = await strapi.getLessonsOfStudentTopic(
      filterLessonsIds,
      token,
      topicId
    );

    lessons.forEach((e: any) => {
      delete e.studentLessons;
    });

    return lessons;
  }

  static async GetStudentRecentLessons(userId: number): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let filterLessonsIds: number[] = [];
    let studentLessons = await StudentLessonsUtil.GetStudentLessons(userId);

    studentLessons = JSON.parse(JSON.stringify(studentLessons));
    if (studentLessons.length == 0) {
      throw new NotFoundError(...a(`No lesson found`));
    }

    studentLessons.forEach((e: any) => {
      filterLessonsIds.push(e.lesson.id);
    });

    if (filterLessonsIds.length == 0)
      throw new NotFoundError(...a(`No lesson found`));

    let lessons = await strapi.getLessonsOfStudentTopic(
      filterLessonsIds,
      token
    );

    lessons.forEach((e: any) => {
      delete e.studentLessons.id;
      delete e.studentLessons.noNameUser;
      delete e.studentLessons.lesson;
    });

    return lessons;
  }

  static async PostLesson(lesson: Lesson): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let lessonRes = await strapi.postLessons(lesson, token);
    return lessonRes;
  }

  static async GetLessonById(
    lessonId: number,
    shouldThrowNotFound: boolean
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let lessons = await strapi.getLessonById(lessonId, token);

    if (lessons.length <= 0 && shouldThrowNotFound)
      throw new NotFoundError(...a(`No lesson found`));

    return lessons;
  }

  static async GetLessonByIds(lessonIds: number[]): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let lessons = await strapi.getLessonByIds(lessonIds, token);

    return lessons;
  }

  static async GetAllLessonsByTopics(topicIds: any[]) {
    let token = await StrapiCore.AuthToken();
    let lessonRes = await strapi.getAllLessonsByTopics(topicIds, token);
    return lessonRes;
  }

  static async DeleteLessonById(lesson: any) {
    let token = await StrapiCore.AuthToken();

    let lessonsRes = await this.GetLessonById(lesson.id, false);

    let studentLessonIds = [];
    if (lessonsRes.length > 0) {
      for (let stdLesson of lessonsRes[0].studentLessons) {
        studentLessonIds.push(stdLesson.id);
      }
    }

    if (studentLessonIds.length > 0) {
      let deleteStdLessonRes = await StudentLessonsUtil.UnassignLessonToStudent(
        studentLessonIds
      );
    }

    let deleteLessonRes = await strapi.deleteLessonById(lesson.id, token);

    return lessonsRes;
  }

  static async DeleteLessonByTopic(topicId: number) {
    let token = await StrapiCore.AuthToken();
    let lessons: any[] = await this.GetAllLessonsByTopics([topicId]);

    if (lessons.length > 0) {
      let deleteStudentLessonsRequests = [];
      for (let lesson of lessons) {
        deleteStudentLessonsRequests.push(
          StudentLessonsUtil.DeleteStudentLessonByLesson(lesson.id)
        );
      }

      let deleteStdLessons = await Promise.all(deleteStudentLessonsRequests);
    }

    let lessonRes = await strapi.deleteLessonByTopic(topicId, token);
    return lessons;
  }

  static async UpdateLesson(lesson: Lesson): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let lessonRes = await strapi.updateLessons(lesson, token);
    return lessonRes;
  }

  static async DeleteLessonByIds(lessonIds: number[]) {
    let token = await StrapiCore.AuthToken();

    let lessons = await this.GetLessonByIds(lessonIds);
    let lessonDbIds = [];
    let studentLessonIds = [];
    if (lessons.length > 0) {
      for (let lesson of lessons) {
        lessonDbIds.push(lesson.id);
        for (let stdLesson of lesson.studentLessons) {
          studentLessonIds.push(stdLesson.id);
        }
      }
    }

    if (studentLessonIds.length > 0) {
      let deleteStdLessonRes =
        await StudentLessonsUtil.UnassignLessonToStudentByIds(studentLessonIds);
    }

    let deleteLessonRes = await strapi.deleteLessonByIds(lessonDbIds, token);
    return lessons;
  }

  static async GetStudentLessonCount(
    userId: number,
    isCompleted: boolean
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let noNameUser = await noNameUserUtil.GetnoNameUserStarpi(userId!);
    if (noNameUser.length < 0)
      return new BadRequestError(...a(`Couldn't get lessons for this user`));

    let studentLessonsCount = await strapi.getLessonsCountOfStudent(
      isCompleted,
      noNameUser[0].id,
      token
    );

    return studentLessonsCount;
  }
}
