import {
  Role,
  User,
  Student,
  sequelize,
  Teacher,
  TeacherStudent,
  op as Op,
} from "../../../sequelize";
import { SequelizeAttributes, StudentStatus } from "../../../sequelize/types";
import {
  BadRequestError,
  NotFoundError,
} from "../../../sequelize/utils/errors";
import { loginCoreArgs, UserCore } from "../user/user-core";
import bcrypt from "bcrypt";
import { Configurations } from "../../../configs/config-main";
import { a } from "../../../sequelize/locales";
import { noNameUser } from "../../thirdparty/strapi";
import { noNameUserUtil } from "../strapi/noNameUser";

const authConfig = Configurations.AuthorizationConfigurations;

export interface PagingParams {
  limit: number;
  offset: number;
  page: number;
}

export class StudentCore extends UserCore {
  async RegisterUser(
    user: User,
    returns = SequelizeAttributes.WithoutIndexes
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(
      user.password!,
      authConfig.salt_round!
    );
    let userPassword = user.password;
    user.password = passwordHash;

    const transaction = await sequelize.transaction();

    let newUser = await User.findOrCreateSafe<User>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: user,
        where: { email: user.email },
        transaction,
      }
    );

    let student = await Student.findOrCreateSafe<Student>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: {
          studentId: newUser[0]._userId,
          status: "new",
        } as any,
        where: { studentId: newUser[0]._userId },
        transaction,
      }
    );

    await transaction.commit();
    let noNameUser: noNameUser = {
      name: user?.name,
      email: user?.email,
      noNameUserUuid: newUser[0].userId,
    };
    let noNameUserRes = await noNameUserUtil.CreatenoNameUser(
      newUser[0]._userId!,
      noNameUser,
      "student"
    );
    let userRes = (await this.GetUserById({
      key: newUser[0]._userId!,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
      raw: true,
      nest: true,
    } as any)) as any;

    return userRes!;
  }

  async GetUser(args: loginCoreArgs): Promise<User> {
    let user = (await User.findOneSafe<User>(args.returns, {
      include: [
        Role,
        {
          model: Student,
          include: [
            {
              model: Teacher,
              include: [User],
            },
          ],
        },
      ],
      where: {
        [args.type!]: args.key,
        roleId: "student",
      },
      raw: args.raw,
      nest: args.nested,
    })) as any;

    if (!user && args.shouldThrowNotFound) {
      throw new NotFoundError(...a(`User with ${args.key} Not found`));
    }

    args.returns == SequelizeAttributes.WithoutIndexes && delete user.password;

    return user;
  }

  static async GetStudents(
    limit: number,
    offset: number,
    name: any,
    returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
  ): Promise<User[]> {
    let condtions: any = { roleId: "student" };
    if (name) {
      condtions = { roleId: "student", name: { [Op.like]: `%${name}%` } };
    }

    let user = await User.findAllSafe<User[]>(returns, {
      include: [
        Role,
        {
          model: Student,
          include: [
            {
              model: Teacher,
              include: [User],
            },
          ],
        },
      ],
      where: condtions,
      limit: limit,
      offset: offset,
    });

    if (user.length <= 0) {
      throw new NotFoundError(...a(`No student found`));
    }

    return user;
  }

  async LoginUser(email: string, password: string): Promise<User> {
    let user = (await this.GetUserByEmail({
      key: email,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
      raw: true,
      nested: true,
    } as any)) as any;

    if (!bcrypt.compareSync(password, user!.password!))
      throw new BadRequestError(...a(`Either email or password is Invalid!`));

    return user!;
  }

  async UpdateUser(userId: String, status: StudentStatus): Promise<User> {
    let user = await this.GetUserByUuid({
      key: userId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    } as any);

    let updateStudent = await Student.update(
      {
        status: status,
      },
      { where: { studentId: user!._userId } }
    );

    user = await this.GetUserById({
      key: user!._userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any);

    return user!;
  }

  static async GetTeacher(
    studentId: number,
    returns = SequelizeAttributes.WithoutIndexes,
    shouldThrowNotFound: boolean = false
  ): Promise<TeacherStudent> {
    let teacherOfStudent = await TeacherStudent.findOneSafe<TeacherStudent>(
      returns,
      {
        include: [
          {
            model: Student,
            include: [
              {
                model: Teacher,
                include: [User],
              },
            ],
          },
        ],
        where: {
          studentId: studentId,
        },
      }
    );

    if (!teacherOfStudent && shouldThrowNotFound)
      throw new NotFoundError(...a(`No teacher assign`));

    return teacherOfStudent;
  }

  static async GetStudentsByIdWhereIn(Ids: any[]): Promise<User[]> {
    let users = await User.findAllSafe<User[]>(
      SequelizeAttributes.WithoutIndexes,
      {
        include: [
          Role,
          {
            model: Student,
            include: [
              {
                model: Teacher,
                include: [User],
              },
            ],
          },
        ],
        where: {
          roleId: "student",
          _userId: {
            [Op.in]: Ids,
          },
        },
      }
    );

    if (users.length <= 0) {
      throw new NotFoundError(...a(`No student found`));
    }

    return users;
  }

  async GoogleLoginUser(data: any): Promise<User> {
    let newUserData = { email: data.email, name: data.name, roleId: "student" };
    const transaction = await sequelize.transaction();
    let newUser = await User.findOrCreateSafe<User>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: newUserData as any,
        where: { email: data.email },
        transaction,
      }
    );

    let student = await Student.findOrCreateSafe<Student>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: {
          studentId: newUser[0]._userId,
          status: "new",
        } as any,
        where: { studentId: newUser[0]._userId },
        transaction,
      }
    );

    await transaction.commit();

    let noNameUser: noNameUser = {
      name: data?.name,
      email: data?.email,
      noNameUserUuid: newUser[0].userId,
    };

    let noNameUser = await noNameUserUtil.CreatenoNameUser(
      newUser[0]._userId!,
      noNameUser,
      "student"
    );

    let user = await this.GetUser({
      type: "_userId",
      key: newUser[0]._userId,
      returns: SequelizeAttributes.WithIndexes,
      raw: true,
      nested: true,
    });

    return user;
  }

  static async GetStudentOfTeacher(
    type: "studentId" | "teacherId",
    key: any,
    paging: PagingParams,
    returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes
  ): Promise<Student[]> {
    let studentsOfTeacher = await Student.findAll({
      include: [
        {
          model: User,
          attributes: [
            "userId",
            "name",
            "profilepicture",
            "about",
            "roleId",
            "email",
            "createdAt",
          ],
          where: {
            roleId: "student",
          },
        },
      ],
      attributes: { exclude: ["studentId", "teacherId"] },
      where: {
        [type]: key,
      },
      offset: paging.offset,
      limit: paging.limit,
    });

    return studentsOfTeacher;
  }

  static async GetCountOfStudentOfTeacher(
    type: "studentId" | "teacherId",
    key: any
  ): Promise<number> {
    let count = await Student.count({
      where: {
        [type]: key,
      },
    });
    return count;
  }
}
