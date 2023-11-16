
'use strict'

import { NotFoundError } from "../../../sequelize/utils/errors"


import { Configurations } from "../../../configs/config-main"
import { Role, User, op as Op } from "../../../sequelize"
import { SequelizeAttributes } from "../../../sequelize/types/SequelizeAttributes"

import { StudentStatus, TeacherStatus, UserSearchType } from "../../../sequelize/types";
import * as _ from "lodash"
import { a } from "../../../sequelize/locales"

const authConfig = Configurations.AuthorizationConfigurations

export interface loginCoreArgs {
    type?: UserSearchType
    key: any
    returns?: SequelizeAttributes
    shouldThrowNotFound?: boolean
    nested?: boolean
    raw?: boolean
}


export abstract class UserCore {

    abstract RegisterUser(user: User): Promise<User>;

    abstract GetUser(args: loginCoreArgs): Promise<User | undefined>;

    abstract LoginUser(email: string, password: string): Promise<User>;

    abstract UpdateUser(userId: String, status: StudentStatus | TeacherStatus): Promise<User>;

    abstract GoogleLoginUser(data: any): Promise<User>;

    private static setDefaultValues(args: loginCoreArgs) {
        const _args = _.clone(args)

        _args.returns = _args.returns ?? SequelizeAttributes.WithoutIndexes
        _args.raw = _args.raw ?? false
        _args.nested = _args.nested ?? false
        _args.shouldThrowNotFound = _args.shouldThrowNotFound ?? false
        return _args
    }


    async GetUserById(args: loginCoreArgs): Promise<User | undefined> {
        const _args = UserCore.setDefaultValues(args)
        _args.type = '_userId'
        return this.GetUser(_args)
    }

    async GetUserByUuid(args: loginCoreArgs): Promise<User | undefined> {
        const _args = UserCore.setDefaultValues(args)
        _args.type = 'userId'
        return this.GetUser(_args)
    }

    async GetUserByEmail(args: loginCoreArgs): Promise<User | undefined> {
        const _args = UserCore.setDefaultValues(args)
        _args.type = 'email'
        return this.GetUser(_args)
    }

    static async GetUserByWhereIn(type: string, key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes): Promise<User[]> {
        let users: User[] = await User.findAllSafe<User[]>(returns, {
            include: [Role],
            where: {
                [type]: {
                    [Op.in]: key
                }
            }
        })
        return users
    }

    static async GetUserCore(type: string, key: any,
        returns: SequelizeAttributes = SequelizeAttributes.WithoutIndexes ,
        shouldThrowNotFound:boolean = false): Promise<User> {
        let user: User = await User.findOneSafe<User>(returns, {
            include: [Role],
            where: {
                [type]: key
            },
            raw:true,
            nest:true
        })
        if(!user && shouldThrowNotFound)
            throw new NotFoundError(...a('No user found'))
            
        return user
    }


}