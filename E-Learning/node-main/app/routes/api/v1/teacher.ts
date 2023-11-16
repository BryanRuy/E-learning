
'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as TeacherCtrl from "../../../controllers/teacher"
import { TeacherProfileCtrl, PaymentCtrl } from '../../../controllers/profile'
import multer from "multer"
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'
var upload = multer()

const router = express.Router()

router.get('/', AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetActiveTeachers)
router.get('/all-teachers', AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetAllTeachers)

router.get('/tests', AuthorizeUtil.AuthorizeTeacher, TeacherCtrl.GetTeacherTests);

router.put(`/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeTeacher, TeacherCtrl.UpdateTeacherStatus)
router.get(`/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetTeacher)

router.get(`/:email`, AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetTeacherByEmail)


router.get(`/:userId(${UUID_REGEX_ROUTE})/students`, AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetTeacherStudents)
router.post(`/:userId(${UUID_REGEX_ROUTE})/profile-picture`, AuthorizeUtil.AuthorizeUser, upload.single('file'), TeacherProfileCtrl.UpdateProfilePicture)
router.put(`/:userId(${UUID_REGEX_ROUTE})/profile`, AuthorizeUtil.AuthorizeUser, TeacherProfileCtrl.UpdateBasicInfo)
router.put(`/:userId(${UUID_REGEX_ROUTE})/password`, AuthorizeUtil.AuthorizeUser, TeacherProfileCtrl.UpdatePassword)

router.get(`/:email/students`, AuthorizeUtil.AuthorizeUser, TeacherCtrl.GetTeacherStudentsByEmail)


export default router