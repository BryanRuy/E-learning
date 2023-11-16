import { a } from "../../../sequelize/locales";
import {
  BadRequestError,
  NotFoundError,
} from "../../../sequelize/utils/errors";
import { noNameUserUtil } from "./noNameUser";
import { strapi, StrapiCore } from "./strapi-core";

export interface studentLesson {
  noNameUser: number;
  isCompleted?: boolean;
  lesson: number;
}

export class StudentLessonsUtil {
  static async AssignLessonToStudent(
    lessonId: number,
    userIds: number[]
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let noNameUsers = await noNameUserUtil.GetnoNameUsersStarpiByIds(userIds);

    if (noNameUsers.length <= 0)
      throw new BadRequestError(
        ...a("You cannot  assign lesson to this student")
      );

    let requests: Promise<any>[] = [];

    noNameUsers.forEach((user: any) => {
      let studentLesson: studentLesson = {
        noNameUser: user.id,
        lesson: lessonId,
        isCompleted: false,
      };
      requests.push(strapi.assignLessonToStudent(studentLesson, token));
    });

    return Promise.all(requests);
  }

  static async UnassignLessonToStudent(
    studentLessonIds: number[]
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();
    let requests: Promise<any>[] = [];

    studentLessonIds.forEach((id: any) => {
      requests.push(strapi.unassignOrDeleteLessonToStudent(id, token));
    });

    return await Promise.all(requests);
  }

  static async UpdateStudentLessons(
    isCompleted: boolean,
    studentLessonId: number
  ) {
    let token = await StrapiCore.AuthToken();
    let lessonRes = await strapi.updateStudentLesson(
      isCompleted,
      studentLessonId,
      token
    );
    return lessonRes;
  }

  static async GetStudentLessonsByIds(ids: any[]) {
    let token = await StrapiCore.AuthToken();
    let studentlessonRes = await strapi.getStudentLessonsByIds(ids, token);
    return studentlessonRes;
  }

  static async GetStudentLessons(studentId: number) {
    let token = await StrapiCore.AuthToken();
    let noNameUser = await noNameUserUtil.GetnoNameUserStarpi(studentId);

    if (noNameUser.length <= 0)
      throw new BadRequestError(...a("You have no lessons"));
    let lessonRes = await strapi.getStudentLessons(noNameUser[0].id, token);

    return lessonRes;
  }

  static async GetStudentLessonsByLesson(lessonId: number) {
    let token = await StrapiCore.AuthToken();

    let lessonRes = await strapi.getStudentLessonsByLesson(lessonId, token);
    return lessonRes;
  }

  static async DeleteStudentLessonByLesson(lessonId: number) {
    let token = await StrapiCore.AuthToken();

    let studentLessonRes = await strapi.getStudentLessonsByLesson(
      lessonId,
      token
    );

    if (studentLessonRes.length > 0) {
      let deleteStdLessons = await strapi.deleteStudentLessonsByLesson(
        lessonId,
        token
      );
    }

    return studentLessonRes;
  }

  static async UnassignLessonToStudentByIds(
    studentLessonIds: number[]
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let studentLessonDb = await this.GetStudentLessonsByIds(studentLessonIds);

    let ids = [];
    for (let stdLesson of studentLessonDb) {
      ids.push(stdLesson.id);
    }
    if (ids.length > 0)
      await strapi.unassignOrDeleteLessonToStudentsByIds(ids, token);

    return studentLessonDb;
  }
}
