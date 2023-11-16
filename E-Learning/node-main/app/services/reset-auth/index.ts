import _ from "lodash";
import { User } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { ResetAuth } from "../../../sequelize/models/ResetAuth";
import { SequelizeAttributes } from "../../../sequelize/types";
import { NotFoundError } from "../../../sequelize/utils/errors";

export interface ResetCoreArgs {
 type?:any
 key:any
 returns?: SequelizeAttributes
 shouldThroeNotFound?: boolean
}

export class ResetAuthCore {

    private static setDefaultArgs(_args: ResetCoreArgs){
        let args = _.clone(_args)  
         args.returns = args.returns ??  SequelizeAttributes.WithoutIndexes
         args.shouldThroeNotFound = args.shouldThroeNotFound ?? false
         return args
    }

    private static async GetResetAuth(_args: ResetCoreArgs):Promise<ResetAuth[]>{
        let args = this.setDefaultArgs(_args)
        let auth = await ResetAuth.findAllSafe<ResetAuth[]>(args.returns,{
            include:[User],
            where:{
                [args.type]:args.key
            }
        })

        if(auth.length === 0 && args.shouldThroeNotFound)
            throw new NotFoundError(...a('Your session expires.'))

        return auth
    }

    static async GetResetAuthById(_args: ResetCoreArgs):Promise<ResetAuth>{
        _args.type = '_authId'
        let auth = await this.GetResetAuth(_args)
        return auth[0]
    }

    static async GetResetAuthByUuid(_args: ResetCoreArgs):Promise<ResetAuth>{
        _args.type = 'authId'
        let auth = await this.GetResetAuth(_args)
        return auth[0]
    }

    static async GetResetAuthByUserId(_args: ResetCoreArgs):Promise<ResetAuth[]>{
        _args.type = 'userId'
        return await this.GetResetAuth(_args)
    }

    static async CreateAuth(data:any, returns:SequelizeAttributes = SequelizeAttributes.WithoutIndexes):Promise<ResetAuth>{

        const auth = await ResetAuth.create(
            data
        )

        let authData = await this.GetResetAuthById({
              key:auth._authId,
              returns:returns})

        return  authData
    }

    private static async UpdateAuth(type:any, key:any , data:any, returns:SequelizeAttributes ):Promise<ResetAuth>{

        const auth = await ResetAuth.update(
            {...data},
            { where:{
                [type]: key
           }}    
        )

        let authData = type == '_authId'
              ? await ResetAuthCore.GetResetAuthById({ key:key,returns:returns})
              : await ResetAuthCore.GetResetAuthByUuid({ key:key,returns:returns})

        return  authData
    }

    static async updateAuthById(data:any ,returns:SequelizeAttributes = SequelizeAttributes.WithoutIndexes){
        return await ResetAuthCore.UpdateAuth('_authId',data._authId, data, returns)
    }

    static async updateAuthByUuid(data:any ,returns:SequelizeAttributes = SequelizeAttributes.WithoutIndexes){
        return await ResetAuthCore.UpdateAuth('authId',data.authId, data, returns)
    }

}