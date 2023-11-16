'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as UserCtrl from '../../../controllers/users'
import multer from "multer"
import * as SuperAdminCtrl from '../../../controllers/super-admin'
import {SuperAdminProfileCtrl}  from '../../../controllers/profile'
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'
var upload = multer()
const router = express.Router()


router.get(`/`, AuthorizeUtil.AuthorizeSuperAdmin, SuperAdminCtrl.GetSuperAdmins)
router.post('/admin', AuthorizeUtil.AuthorizeSuperAdmin, UserCtrl.RegisterAdminUser)

router.get(`/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeSuperAdmin, SuperAdminCtrl.GetSuperAdmin)
router.post(`/:userId(${UUID_REGEX_ROUTE})/profile-picture`, AuthorizeUtil.AuthorizeUser, upload.single('file'), SuperAdminProfileCtrl.UpdateProfilePicture)
router.put(`/:userId(${UUID_REGEX_ROUTE})/profile`, AuthorizeUtil.AuthorizeUser, SuperAdminProfileCtrl.UpdateBasicInfo)
router.put(`/:userId(${UUID_REGEX_ROUTE})/password`, AuthorizeUtil.AuthorizeUser, SuperAdminProfileCtrl.UpdatePassword)

router.put(`/:userId(${UUID_REGEX_ROUTE})/update-users-password`, AuthorizeUtil.AuthorizeUser, SuperAdminProfileCtrl.UpdateUsersPasswordBySuperAdmin)

export default router
