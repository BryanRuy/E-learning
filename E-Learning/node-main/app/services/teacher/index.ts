import {
  Teacher,
  User,
  sequelize,
  Role,
  Student,
  TeacherStudent,
  op as Op,
} from "../../../sequelize";
import { SequelizeAttributes, TeacherStatus } from "../../../sequelize/types";
import { loginCoreArgs, UserCore } from "../user/user-core";
import bcrypt from "bcrypt";
import { Configurations } from "../../../configs/config-main";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { noNameUser } from "../../thirdparty/strapi";
import { noNameUserUtil } from "../strapi/noNameUser";

const authConfig = Configurations.AuthorizationConfigurations;

export class TeacherCore extends UserCore {
  async RegisterUser(
    user: User,
    returns = SequelizeAttributes.WithoutIndexes
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(
      user.password!,
      authConfig.salt_round!
    );
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

    let teacher = await Teacher.findOrCreateSafe<Teacher>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: {
          teacherId: newUser[0]._userId,
          status: "new",
        } as any,
        where: { teacherId: newUser[0]._userId },
        transaction,
      }
    );

    await transaction.commit();
    let noNameUser: noNameUser = {
      name: user?.name,
      email: user?.email,
      noNameUserUuid: newUser[0].userId,
    };
    let noNameUser = await noNameUserUtil.CreatenoNameUser(
      newUser[0]._userId!,
      noNameUser,
      "teacher"
    );

    let userRes = await this.GetUserById({
      type: "_userId",
      key: newUser[0]._userId!,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
      raw: true,
      nest: true,
    } as any);

    return userRes!;
  }

  async GetUser(args: loginCoreArgs): Promise<User | any | undefined> {
    let user = (await User.findOneSafe<User>(args.returns, {
      include: [
        Role,
        {
          model: Teacher,
          include: [
            {
              model: Student,
              include: [User],
            },
          ],
        },
      ],
      where: {
        [args.type!]: args.key,
        roleId: "teacher",
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

  static async GetTeacherCount(name: any): Promise<number> {
    let condtions: any = { roleId: "teacher" };
    if (name) {
      condtions = { roleId: "teacher", name: { [Op.like]: `%${name}%` } };
    }
    let teachersCount = User.count({
      where: condtions,
    });
    return teachersCount;
  }

  static async GetTeachers(
    offset: number,
    limit: number,
    name?: any,
    returns = SequelizeAttributes.WithoutIndexes
  ): Promise<User[] | undefined> {
    let condtions: any = { roleId: "teacher" };
    if (name) {
      condtions = { roleId: "teacher", name: { [Op.like]: `%${name}%` } };
    }
    let user = await User.findAllSafe<User[]>(returns, {
      include: [
        Role,
        {
          model: Teacher,
          include: [
            {
              model: Student,
              include: [User],
            },
          ],
        },
      ],
      where: condtions,
      subQuery: true,
      limit: limit,
      offset: offset,
    });

    if (user.length <= 0) {
      throw new NotFoundError(...a(`No teacher found`));
    }

    return user;
  }

  async LoginUser(email: string, password: string): Promise<User> {
    let user = await this.GetUserByEmail({
      key: email,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
      raw: true,
      nested: true,
    } as any);

    if (!bcrypt.compareSync(password, user!.password!))
      throw new BadRequestError(...a(`Either email or password is Invalid!`));

    delete user?.password;

    return user!;
  }

  // static async GetStudentsOfTeacher(teacherId: number, limit:number, offset:number,
  //     returns = SequelizeAttributes.WithoutIndexes,
  //     shouldThrowNotFound: boolean = false): Promise<Student[] | undefined> {

  //     let studentsOfTeacher = await TeacherStudent.findOneSafe<TeacherStudent>(returns, {
  //         include: [{
  //             model: Teacher,
  //             include: [{
  //                 model: Student,
  //                 include: [User]
  //             }]
  //         }],
  //         where: {
  //             teacherId: teacherId
  //         },
  //         offset:offset,
  //         limit:limit

  //     });

  //     if (!studentsOfTeacher && shouldThrowNotFound) {
  //         throw new NotFoundError(...a(`No student assign`))
  //     }

  //     return studentsOfTeacher.teacher.students;
  // }
  // static async GetStudentsOfTeacherCount(teacherId: number): Promise<number> {

  //     let count = await TeacherStudent.count<TeacherStudent>({

  //         where: {
  //             teacherId: teacherId
  //         }
  //     });

  //     return count
  // }

  async UpdateUser(userId: String, status: TeacherStatus): Promise<User> {
    let user = await this.GetUserByUuid({
      key: userId,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
    } as any);

    let updateTeacher = await Teacher.update(
      {
        status: status!,
      },
      { where: { teacherId: user!._userId } }
    );

    user = await this.GetUserById({
      key: user!._userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any);

    return user!;
  }

  async GoogleLoginUser(data: any): Promise<User> {
    let newUserData = { email: data.email, name: data.name, roleId: "teacher" };
    const transaction = await sequelize.transaction();

    let newUser = await User.findOrCreateSafe<User>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: newUserData as any,
        where: { email: data.email },
        transaction,
      }
    );

    let teacher = await Teacher.findOrCreateSafe<Teacher>(
      SequelizeAttributes.WithIndexes,
      {
        defaults: {
          teacherId: newUser[0]._userId,
          status: "new",
        } as any,
        where: { teacherId: newUser[0]._userId },
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
      "teacher"
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
}
