import { User, sequelize, Role, op as Op } from "../../../sequelize";
import { UserSearchType, SequelizeAttributes } from "../../../sequelize/types";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { loginCoreArgs, UserCore } from "../user/user-core";
import { Configurations } from "../../../configs/config-main";
import { a } from "../../../sequelize/locales";
import { noNameUser } from "../../thirdparty/strapi";
import { noNameUserUtil } from "../strapi/noNameUser";
import bcrypt from "bcrypt";
import { GoogleCore } from "../google";
const authConfig = Configurations.AuthorizationConfigurations;

export class AdminCore extends UserCore {
  GoogleLoginUser(data: any): Promise<User> {
    throw new Error("Method not implemented.");
  }

  UpdateUser(
    userId: String,
    status: "new" | "waiting-for-teacher" | "active" | "blocked" | "approved"
  ): Promise<User> {
    throw new Error("Method not implemented.");
  }

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

    await transaction.commit();
    let noNameUser: noNameUser = {
      name: user?.name,
      email: user?.email,
      noNameUserUuid: newUser[0].userId,
    };
    let noNameUserRes = await noNameUserUtil.CreatenoNameUser(
      newUser[0]._userId!,
      noNameUser,
      "admin"
    );
    let userRes = await this.GetUserById({
      key: newUser[0]._userId!,
      returns: SequelizeAttributes.WithIndexes,
      shouldThrowNotFound: true,
      raw: true,
      nest: true,
    } as any);
    return userRes!;
  }

  async GetUser(args: loginCoreArgs): Promise<User> {
    let user = await User.findOneSafe<User>(args.returns, {
      include: Role,
      where: {
        [args.type!]: args.key,
        roleId: "admin",
      },
      raw: args.raw,
      nest: args.nested,
    });

    if (!user && args.shouldThrowNotFound) {
      throw new NotFoundError(...a(`User with ${args.key} Not found`));
    }

    args.returns == SequelizeAttributes.WithoutIndexes && delete user.password;

    return user;
  }

  static async GetAdminsCount(name: any): Promise<number> {
    let condtions: any = { roleId: "admin" };
    if (name) {
      condtions = { roleId: "admin", name: { [Op.like]: `%${name}%` } };
    }
    let userCount = await User.count({
      include: Role,
      where: condtions,
    });

    return userCount;
  }

  static async GetAdmins(
    offset: number,
    limit: number,
    name?: any,
    returns = SequelizeAttributes.WithoutIndexes
  ): Promise<User[]> {
    let condtions: any = { roleId: "admin" };
    if (name) {
      condtions = { roleId: "admin", name: { [Op.like]: `%${name}%` } };
    }
    let user = await User.findAllSafe<User[]>(returns, {
      include: Role,
      where: condtions,
      subQuery: false,
      limit: limit,
      offset: offset,
    });

    if (user.length <= 0) {
      throw new NotFoundError(...a(`No Admin found`));
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
}
