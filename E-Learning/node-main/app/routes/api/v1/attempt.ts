'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'
import * as AttemptCtrl from '../../../controllers/attempt'

const router = express.Router()

router.post(`/`, AuthorizeUtil.AuthorizeStudent, AttemptCtrl.CreateAttempt)
router.put(`/`, AuthorizeUtil.AuthorizeStudent, AttemptCtrl.UpdateAttempt)
router.get(`/:attemptId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, AttemptCtrl.GetAttempt)
router.put(`/:attemptId(${UUID_REGEX_ROUTE})/subjective-marks`, AuthorizeUtil.AuthorizeTeacher, AttemptCtrl.UpdateSubjectiveMarks)

export default router