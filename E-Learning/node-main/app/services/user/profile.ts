import { RoleType, SequelizeAttributes } from "../../../sequelize/types";
import { User } from "../../../sequelize";
import { UserFactory } from "./user-factory";
import bcrypt from "bcrypt";
import { Configurations } from "../../../configs/config-main";
import {
  BadRequestError,
  UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { a } from "../../../sequelize/locales";
import { noNameUser } from "../../thirdparty/strapi";
import { noNameUserUtil } from "../strapi";
import { ResetAuthCore } from "../reset-auth";
import moment from "moment";
import { ResetAuth } from "../../../sequelize/models/ResetAuth";
import { Logger } from "../../../sequelize/utils/logger";

const authConfig = Configurations.AuthorizationConfigurations;

export class ProfileUtil {
  static async UpdateBasicInfo(
    params: User,
    userId: number,
    role: RoleType
  ): Promise<User> {
    let updatedUser = await User.update(
      {
        ...params,
      },
      { where: { _userId: userId } }
    );

    let userCore = UserFactory(role);
    let user = (await userCore.GetUserById({
      key: userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;

    let noNameUser: noNameUser = {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      noNameUserId: userId,
      type: role,
    };

    let noNameUserRes = await noNameUserUtil.UpdatenoNameUser(noNameUser);

    return user;
  }

  static async UpdatePassword(
    newPassword: string,
    currentPassword: string,
    user: User,
    role: RoleType
  ): Promise<User> {
    let userCore = UserFactory(role);

    const passwordHash = await bcrypt.hash(newPassword, authConfig.salt_round!);

    if (!bcrypt.compareSync(currentPassword, user!.password!))
      throw new BadRequestError(...a(`password is Invalid!`));

    let updatedUser = await User.update(
      {
        password: passwordHash,
      },
      { where: { _userId: user._userId } }
    );

    user = (await userCore.GetUserById({
      key: user._userId!,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;

    return user;
  }

  static async UpdateUserProfilePicture(
    profilePic: string,
    userId: number,
    role: RoleType
  ): Promise<User> {
    let userCore = UserFactory(role);

    let updatedUser = await User.update(
      {
        profilePicture: profilePic,
      } as any,
      { where: { _userId: userId } }
    );

    let user = (await userCore.GetUserById({
      key: userId,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;

    let noNameUser: noNameUser = {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      noNameUserId: userId,
      type: user.roleId,
    };

    let noNameUserRes = await noNameUserUtil.UpdatenoNameUser(noNameUser);
    return user;
  }

  static async SetupPassword(
    password: string,
    userId: number
  ): Promise<[number, User[]]> {
    const passwordHash = await bcrypt.hash(password, authConfig.salt_round!);

    let updatedUser = await User.update(
      {
        password: passwordHash,
      },
      { where: { _userId: userId } }
    );

    return updatedUser;
  }

  static async ForgetPassword(user: User): Promise<ResetAuth> {
    let data = {
      userId: user._userId,
      expiry: moment().add(60, "minute"),
    };

    return await ResetAuthCore.CreateAuth(
      data,
      SequelizeAttributes.WithIndexes
    );
  }

  static async ResetPassword(
    authId: number,
    password: string,
    userId: number
  ): Promise<[number, User[]]> {
    const passwordHash = await bcrypt.hash(password, authConfig.salt_round!);

    let updatedUser = await User.update(
      {
        password: passwordHash,
      },
      { where: { _userId: userId } }
    );

    let data = {
      _authId: authId,
      isUsed: 1,
    };

    await ResetAuthCore.updateAuthById(data);
    return updatedUser;
  }

  static async UpdateUserPasswordBySuperAdmin(
    newPassword: string,
    user: User,
    role: RoleType
  ): Promise<User> {
    let userCore = UserFactory(role);

    const passwordHash = await bcrypt.hash(newPassword, authConfig.salt_round!);

    let updatedUser = await User.update(
      {
        password: passwordHash,
      },
      { where: { _userId: user._userId } }
    );

    user = (await userCore.GetUserById({
      key: user._userId!,
      returns: SequelizeAttributes.WithoutIndexes,
      shouldThrowNotFound: true,
    } as any)) as any;

    return user;
  }
}
