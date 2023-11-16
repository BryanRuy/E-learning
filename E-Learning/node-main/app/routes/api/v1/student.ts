'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as StudentCtrl from '../../../controllers/student'
import * as TestCtrl from '../../../controllers/test'
import * as AssignmentCtrl from '../../../controllers/assignment'
import * as AttemptCtrl from '../../../controllers/attempt'
import * as AssignAttemptCtrl from '../../../controllers/assignment-attempt'
import { StudentProfileCtrl } from '../../../controllers/profile'
import multer from "multer"
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'

var upload = multer()
const router = express.Router()

router.get(`/`, AuthorizeUtil.AuthorizeUser, StudentCtrl.GetActiveStudents)
router.get(`/all-students`, AuthorizeUtil.AuthorizeUser, StudentCtrl.GetAllStudents)

router.put(`/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, StudentCtrl.UpdateStudentStatus)
router.get(`/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, StudentCtrl.GetStudent)

router.get(`/:email`, AuthorizeUtil.AuthorizeUser, StudentCtrl.GetStudentByEmail)

// router.get(`/:userId/teachers`, AuthorizeUtil.AuthorizeUser, StudentCtrl.GetTeacher)
router.get(`/:userId(${UUID_REGEX_ROUTE})/tests`, AuthorizeUtil.AuthorizeUser, TestCtrl.GetTests)
router.get(`/:userId(${UUID_REGEX_ROUTE})/tests/:testId(${UUID_REGEX_ROUTE})/attempts`, AuthorizeUtil.AuthorizeUser, AttemptCtrl.GetStudentTestAttemptsByTest)
router.get(`/:userId(${UUID_REGEX_ROUTE})/assignments`, AuthorizeUtil.AuthorizeUser, AssignmentCtrl.GetAssignments)
router.get(`/:userId(${UUID_REGEX_ROUTE})/assignments/:assignmentId(${UUID_REGEX_ROUTE})/assignment-attempts`, AuthorizeUtil.AuthorizeUser, AssignAttemptCtrl.GetStudentAssignmentAttemptsByAssignment)


router.put(`/:userId(${UUID_REGEX_ROUTE})/profile`, AuthorizeUtil.AuthorizeUser, StudentProfileCtrl.UpdateBasicInfo)
router.put(`/:userId(${UUID_REGEX_ROUTE})/password`, AuthorizeUtil.AuthorizeUser, StudentProfileCtrl.UpdatePassword)
router.post(`/:userId(${UUID_REGEX_ROUTE})/profile-picture`, AuthorizeUtil.AuthorizeUser, upload.single('file'), StudentProfileCtrl.UpdateProfilePicture)

export default router