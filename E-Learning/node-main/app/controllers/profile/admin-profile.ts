
import { NextFunction, Request, Response } from "express"
import { a } from "../../../sequelize/locales"
import { BadRequestError, UnAuthorizedError } from "../../../sequelize/utils/errors"
import { LocaleDataResponse } from "../../../sequelize/utils/http-response"
import { ProfileUtil } from "../../services/user/profile"
import { v4 } from 'uuid'
import fs from 'fs'
import { Configurations } from "../../../configs/config-main";
import { UserFactory } from "../../services/user/user-factory"
import { SequelizeAttributes } from "../../../sequelize/types"

var configs = Configurations.constants

export async function UpdateBasicInfo(req: Request, res: Response, next: NextFunction) {
    try {

        let role = req.CurrentUser?.roleId
        const userId = req.params?.userId
        const _userId = req.CurrentUser?._userId
        const { name, about , contactNo, city, county, country, address,
             gitLink , fbLink, twitterLink , linkedInLink ,zipCode ,storage} = req.body

        if (!_userId || role == 'student' || role == 'teacher')
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        let adminCore = UserFactory('admin')
        let admin  = await adminCore.GetUserByUuid({
            key:userId, 
            returns:SequelizeAttributes.WithIndexes,
            shouldThrowNotFound:true}) as any

        let params = { name, role, contactNo, city, county, country, address,
             gitLink , fbLink, twitterLink , linkedInLink ,zipCode } as any
        if(about) { params.about = about }
        if(role == 'super-admin' && storage){ params.storage = storage * 1024 * 1024 }

        let user = await ProfileUtil.UpdateBasicInfo(params, admin._userId!, admin.roleId!)
        user = JSON.parse(JSON.stringify(user))
        

        return LocaleDataResponse(res, 200, user)

    } catch (err) {
        next(err)
    }
}

export async function UpdatePassword(req: Request, res: Response, next: NextFunction) {
    try {

       
        let role = req.CurrentUser?.roleId
        const userId = req.params?.userId
        const _userId = req.CurrentUser?._userId
        const { newPassword, currentPassword, confirmPassword } = req.body


        if (!_userId || role == 'student' || role == 'teacher')
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!newPassword)
            throw new BadRequestError(...a('Enter a valid password'))

        if (newPassword != confirmPassword)
            throw new BadRequestError(...a('New password and confirm password does not match'))
    
        let adminCore = UserFactory('admin')
        let admin  = await adminCore.GetUserByUuid({
            key:userId, 
            returns:SequelizeAttributes.WithIndexes,
            shouldThrowNotFound:true}) as any

        const user = await ProfileUtil.UpdatePassword(newPassword, currentPassword, admin, admin.roleId!)

        return LocaleDataResponse(res, 200, user)

    } catch (err) {
        next(err)
    }
}

export async function UpdateProfilePicture(req: Request, res: Response, next: NextFunction) {
    try {

        let role = req.CurrentUser?.roleId
        const userId = req.params?.userId
        const _userId = req.CurrentUser?._userId
        
        if (!_userId || role == 'student' || role == 'teacher')
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!_userId)
            throw new UnAuthorizedError(...a("You are not authorized to access this resource"))

        if (!req.file)
            throw new BadRequestError(...a("Select an image first"))

        let adminCore = UserFactory('admin')
        let admin  = await adminCore.GetUserByUuid({
            key:userId, 
            returns:SequelizeAttributes.WithIndexes,
            shouldThrowNotFound:true}) as any

        let file = req.file
        let fileExts = file.originalname.split(".")
        let ext = fileExts[fileExts.length - 1];
        let fileName = `${v4()}.${ext}`

        fs.writeFileSync(`${configs.profile_picture}/${fileName}`, file.buffer);
        
        const user = await ProfileUtil.UpdateUserProfilePicture(`/profile-pictures/${fileName}`, admin?._userId, admin.roleId)

        return LocaleDataResponse(res, 200, user)

    } catch (err) {
        next(err)
    }
}


