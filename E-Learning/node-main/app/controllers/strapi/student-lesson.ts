import { NextFunction, Request, Response } from "express";
import { a } from "../../../sequelize/locales";
import { SequelizeAttributes } from "../../../sequelize/types";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { LessonsUtil } from "../../services/strapi";
import { StudentLessonsUtil } from "../../services/strapi/student-lesson";
import { UserCore } from "../../services/user/user-core";
import { UserFactory } from "../../services/user/user-factory";

export async function GetStudentLessons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let studentLessons = await StudentLessonsUtil.GetStudentLessons(_userId);
    let lessons: any[] = [];
    studentLessons.forEach((e: any) => {
      lessons.push(e.lesson);
    });
    DataResponse(res, 200, lessons);
  } catch (err) {
    next(err);
  }
}

export async function AssignLessonToStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    let { studentIds, lessonId } = req.body;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (role == "student")
      throw new BadRequestError(
        ...a("You are not authorized to access this resource")
      );

    let DbStudentLessons = await StudentLessonsUtil.GetStudentLessonsByLesson(
      lessonId
    );

    let filteredStudentIds = studentIds.filter(
      (studentId: string) =>
        !DbStudentLessons.find(
          (s: any) => s.noNameUser.noNameUserUuid === studentId
        )
    );

    if (filteredStudentIds.length > 0) {
      let user = await UserCore.GetUserByWhereIn(
        "userId",
        filteredStudentIds,
        SequelizeAttributes.WithIndexes
      );
      let userIds = user.map((u) => u._userId) as any;
      let studentLessons = await StudentLessonsUtil.AssignLessonToStudent(
        lessonId,
        userIds
      );
      DbStudentLessons = [...DbStudentLessons, ...studentLessons];
    }

    DbStudentLessons.forEach((e: any) => {
      delete e.lesson;
      delete e.noNameUser.id;
      delete e.noNameUser.noNameUserId;
    });

    DataResponse(res, 200, DbStudentLessons);
  } catch (err) {
    next(err);
  }
}

export async function UpdateLessonOfStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let { isCompleted, studentLessonId } = req.body;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    let studentLessons = await StudentLessonsUtil.UpdateStudentLessons(
      isCompleted,
      studentLessonId
    );
    DataResponse(res, 200, studentLessons);
  } catch (err) {
    next(err);
  }
}

export async function UnassignLessonToStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let _userId = req.CurrentUser?._userId;
    let role = req.CurrentUser?.roleId;
    let { studentIds, lessonId } = req.body;

    if (!_userId)
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (role == "student")
      throw new BadRequestError(
        ...a("You are not authorized to access this resource")
      );

    if (!studentIds || studentIds.length <= 0)
      throw new BadRequestError(
        ...a("At least select one student to unassign a lesson")
      );

    if (!lessonId) throw new BadRequestError(...a("Select a lesson first"));

    let DbStudentLessons: any[] =
      await StudentLessonsUtil.GetStudentLessonsByLesson(lessonId);
    let matchingStudentLessons = DbStudentLessons.filter(
      (student) => studentIds.indexOf(student.noNameUser.noNameUserUuid) > -1
    );
    let filteredStudentLessonIds = matchingStudentLessons.map(
      (student) => student.id
    );

    if (filteredStudentLessonIds.length > 0) {
      let unassignStudentLessons: any[] =
        await StudentLessonsUtil.UnassignLessonToStudent(
          filteredStudentLessonIds
        );
      DbStudentLessons = DbStudentLessons.filter(
        (student) =>
          !unassignStudentLessons.find((std) => std.id === student.id)
      );
    }

    DbStudentLessons.forEach((e: any) => {
      delete e.lesson;
      delete e.noNameUser.id;
      delete e.noNameUser.noNameUserId;
    });

    DataResponse(res, 200, DbStudentLessons);
  } catch (err) {
    next(err);
  }
}
