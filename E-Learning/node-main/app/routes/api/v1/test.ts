
'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as TestCtrl from '../../../controllers/test'
import * as AttemptCtrl from '../../../controllers/attempt'
import multer from 'multer';
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'


const upload = multer();

const router = express.Router()

router.get('/', AuthorizeUtil.AuthorizeUser, TestCtrl.GetTests)
router.post('/', AuthorizeUtil.AuthorizeTeacher, upload.any(), TestCtrl.CreateTest)
router.put('/', AuthorizeUtil.AuthorizeTeacher, upload.any(), TestCtrl.UpdateTest)

router.post(`/:testId(${UUID_REGEX_ROUTE})/assign`, AuthorizeUtil.AuthorizeTeacher, TestCtrl.AssignTest)
router.delete(`/:testId(${UUID_REGEX_ROUTE})/unassign`, AuthorizeUtil.AuthorizeTeacher, TestCtrl.UnassignTest)

router.get(`/:testId(${UUID_REGEX_ROUTE})/upcoming-tests`, AuthorizeUtil.AuthorizeTeacher, TestCtrl.GetUpcomingTest)
router.get(`/:testId(${UUID_REGEX_ROUTE})/past-tests`, AuthorizeUtil.AuthorizeTeacher, TestCtrl.GetPastTest)

router.get(`/upcoming-tests`, AuthorizeUtil.AuthorizeUser, TestCtrl.GetAllUpcomingTest)
router.get(`/past-tests`, AuthorizeUtil.AuthorizeUser, TestCtrl.GeAllPastTest)

router.get(`/:studentTestId(${UUID_REGEX_ROUTE})/attempts`, AuthorizeUtil.AuthorizeUser, AttemptCtrl.GetStudentTestAttemptsByStudentTestId)

router.get(`/:testId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, TestCtrl.GetTest)
export default router