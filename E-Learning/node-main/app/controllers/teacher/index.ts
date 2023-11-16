import { NextFunction, Request, Response } from "express";
import {
  DataResponse,
  LocaleDataResponse,
} from "../../../sequelize/utils/http-response";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { UserFactory } from "../../services/user/user-factory";
import { TeacherCore } from "../../services/teacher";
import {
  SequelizeAttributes,
  TeacherStatus,
  TeacherStatusEnum,
} from "../../../sequelize/types";
import { a } from "../../../sequelize/locales";
import { TestCore } from "../../services/test";
import { PaymentPlan, Teacher, User } from "../../../sequelize";
import { CheckQueryPagingParams } from "../../utility";
import { StudentTeachertHistoryCore } from "../../services/student-teacher-history";
import { StudentCore } from "../../services/student";
import { PaymentPlansUtil } from "../../services/payment/payment-plans";
import { StudentTeacherHistory } from "../../../sequelize/models/StudentTeacherHistory";
import moment from "moment";

export async function GetTeacher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = req.CurrentUser?.roleId;
    const userId = req.params?.userId;

    if (roleId === "teacher" && userId != req.CurrentUser?.userId)
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let user: User;
    let teacherCore = UserFactory("teacher");
    user = (await teacherCore.GetUserByUuid({
      key: userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;
    let findStudent = user?.teacher?.students?.find(
      (s) => s.user.userId === req.CurrentUser?.userId
    );
    if (findStudent && roleId == "student") {
      user!.teacher!.students?.splice(0, user!.teacher!.students.length);
      return LocaleDataResponse(res, 200, user);
    } else if (roleId == "teacher" && user.userId == req.CurrentUser?.userId)
      return LocaleDataResponse(res, 200, user);
    else if (roleId == "super-admin" || roleId == "admin")
      return LocaleDataResponse(res, 200, user);
    else {
      return DataResponse(res, 200, [], `No teacher found`);
    }
  } catch (err) {
    next(err);
  }
}

export async function GetAllTeachers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _userId = req.CurrentUser?._userId;
    const roleId = req.CurrentUser?.roleId;
    const queryParams = CheckQueryPagingParams(req.query);

    if (!_userId || roleId === "teacher")
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let teachers: any;
    if (roleId === "student") {
      teachers = [];
      let user = await StudentCore.GetTeacher(
        _userId,
        SequelizeAttributes.WithoutIndexes,
        true
      );
      if (user.student && user.student.teacher)
        teachers.push(user.student.teacher.user);
    } else {
      teachers = await TeacherCore.GetTeachers(
        queryParams.offset,
        queryParams.limit
      );
      teachers = JSON.parse(JSON.stringify(teachers));
      teachers?.forEach((t: any) => {
        delete t.teacher.students;
      });
    }

    return DataResponse(res, 200, teachers);
  } catch (err) {
    next(err);
  }
}

export async function GetTeacherStudents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = req.CurrentUser!.roleId;
    const _userId = req.CurrentUser!._userId;
    const userId = req.params!.userId;
    const queryParams = CheckQueryPagingParams(req.query);

    if (
      roleId === "student" ||
      (roleId === "teacher" && userId != req.CurrentUser?.userId)
    )
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let studentsOfTeacher: any = [];
    // if (roleId == "teacher") {
    //     studentsOfTeacher = await TeacherCore.GetStudentsOfTeacher(
    //         _userId!,
    //         SequelizeAttributes.WithoutIndexes,
    //         true
    //     );
    // } else {
    // let teacher = await TeacherCore.GetUserCore(
    //   "userId",
    //   userId,
    //   SequelizeAttributes.WithIndexes
    // );
    // studentsOfTeacher = await TeacherCore.GetStudentsOfTeacher(
    //     teacher._userId!,
    //     SequelizeAttributes.WithoutIndexes,
    //     true
    // );
    // }

    let teacher = await TeacherCore.GetUserCore(
      "userId",
      userId,
      SequelizeAttributes.WithIndexes
    );

    queryParams.limit = 1000;
    studentsOfTeacher = await StudentCore.GetStudentOfTeacher(
      "teacherId",
      teacher._userId,
      queryParams,
      SequelizeAttributes.WithoutIndexes
    );
      

    let studentSet = new Map();
    studentsOfTeacher.forEach((e: any) => {
      if (e.user) studentSet.set(e.user.userId, e.user);
    });
    studentsOfTeacher = [];
    for (let student of studentSet.values()) {
      studentsOfTeacher.push(student);
    }

    return DataResponse(res, 200, studentsOfTeacher);
  } catch (err) {
    next(err);
  }
}


export async function GetTeacherStudentsByEmail(
    req: Request,
    res: Response,
    next: NextFunction
) {
  try {
    const roleId = req.CurrentUser!.roleId;
    const _userId = req.CurrentUser!._userId;
    const email = req.params!.email;
    const queryParams = CheckQueryPagingParams(req.query);

    if (
        roleId === "student" ||
        roleId === "teacher"
    )
      throw new UnAuthorizedError(
          ...a(`You are not authorized to access this resource`)
      );

    let studentsOfTeacher: any = [];
    // if (roleId == "teacher") {
    //     studentsOfTeacher = await TeacherCore.GetStudentsOfTeacher(
    //         _userId!,
    //         SequelizeAttributes.WithoutIndexes,
    //         true
    //     );
    // } else {
    // let teacher = await TeacherCore.GetUserCore(
    //   "userId",
    //   userId,
    //   SequelizeAttributes.WithIndexes
    // );
    // studentsOfTeacher = await TeacherCore.GetStudentsOfTeacher(
    //     teacher._userId!,
    //     SequelizeAttributes.WithoutIndexes,
    //     true
    // );
    // }

    let teacher = await TeacherCore.GetUserCore(
        "email",
        email,
        SequelizeAttributes.WithIndexes
    );

    queryParams.limit = 1000;
    studentsOfTeacher = await StudentCore.GetStudentOfTeacher(
        "teacherId",
        teacher._userId,
        queryParams,
        SequelizeAttributes.WithoutIndexes
    );


    let studentSet = new Map();
    studentsOfTeacher.forEach((e: any) => {
      if (e.user) studentSet.set(e.user.userId, e.user);
    });
    studentsOfTeacher = [];
    for (let student of studentSet.values()) {
      studentsOfTeacher.push(student);
    }

    return DataResponse(res, 200, studentsOfTeacher);
  } catch (err) {
    next(err);
  }
}

export async function GetTeacherByEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.CurrentUser
    const roleId = req.CurrentUser?.roleId
    const studentEmail = req.params?.email


    let teacher;
    if (roleId === 'student' || roleId === 'teacher')
      throw new UnAuthorizedError(...a(`You are not authorized to access this resource`))
    else {
      let teacherCore = UserFactory('teacher')
      teacher = await teacherCore.GetUserByEmail({
        key: studentEmail,
        returns: SequelizeAttributes.WithoutIndexes,
        shouldThrowNotFound: true
      } as any) as any
    }

    if (teacher) return DataResponse(res, 200, teacher)
    else { return DataResponse(res, 200, [], 'No Teacher found') }

  } catch (err) {
    next(err)
  }
}

export async function GetTeacherTests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = req.CurrentUser!.roleId;
    const _userId = req.CurrentUser!._userId;
    const queryParams = CheckQueryPagingParams(req.query);

    if (roleId != "teacher")
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    const testsOfTeacher = await TestCore.GetTestByTeacherId(
      _userId!,
      queryParams.limit,
      queryParams.offset
    );
    return DataResponse(res, 200, testsOfTeacher);
  } catch (err) {
    next(err);
  }
}

export async function UpdateTeacherStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    const _userId = req.CurrentUser?._userId;
    const role = req.CurrentUser?.roleId;
    const status = req.body.status;

    if (
      role == "student" ||
      (role == "teacher" && userId != req.CurrentUser?.userId)
    )
      throw new UnAuthorizedError(
        ...a("You are not authorized to access this resource")
      );

    if (!TeacherStatusEnum.includes(status as TeacherStatus))
      throw new BadRequestError(...a("Invalid status type"));

    let userCore = UserFactory("teacher");
    let user: User = await userCore.UpdateUser(userId, status!);

    return DataResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
}

export async function GetActiveTeachers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleId = req.CurrentUser?.roleId;
    const _userId = req.CurrentUser?._userId;
    const name = req.query.name;
    const queryParams = CheckQueryPagingParams(req.query);

    if (roleId == "teacher")
      throw new UnAuthorizedError(
        ...a(`You are not authorized to access this resource`)
      );

    let count = 0,
      data;

    let teachers: any =
      roleId === "student"
        ? await StudentCore.GetTeacher(
            _userId!,
            SequelizeAttributes.WithoutIndexes,
            true
          )
        : await TeacherCore.GetTeachers(
            queryParams.offset,
            queryParams.limit,
            name
          );

    if (roleId === "admin" || roleId === "super-admin") {
      let paymentPlans: any = await PaymentPlan.findAll({
        include: [User],
      });
      paymentPlans = JSON.parse(JSON.stringify(paymentPlans));
      teachers = JSON.parse(JSON.stringify(teachers));

      teachers.forEach((teacher: any, index: number) => {
        let plan = paymentPlans.find(
          (p: any) => p.user.userId == teacher.userId
        );

        if (plan) {
          teachers[index].paymentPlan = {
            startDate: plan.startDate
              ? moment(plan.startDate).format("MMM DD, YY")
              : "N/A",
            endDate: plan.endDate
              ? moment(plan.endDate).format("MMM DD, YY")
              : "N/A",
          };
        }
      });
    }

    count = await TeacherCore.GetTeacherCount(name);
    data = teachers;

    if (roleId != "student") data = { data: teachers, count: count };
    return DataResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
}
