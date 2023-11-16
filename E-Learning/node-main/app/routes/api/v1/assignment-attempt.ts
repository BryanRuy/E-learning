'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'
import * as AssignmentAttemptCtrl from '../../../controllers/assignment-attempt'

const router = express.Router()

router.post(`/`, AuthorizeUtil.AuthorizeStudent, AssignmentAttemptCtrl.CreateAssignmentAttempt)
router.put(`/`, AuthorizeUtil.AuthorizeStudent, AssignmentAttemptCtrl.UpdateAssignmentAttempt)

router.get(`/:assignmentAttemptId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, AssignmentAttemptCtrl.GetAssignmentAttempt)
router.put(`/:assignmentAttemptId(${UUID_REGEX_ROUTE})/add-marks`, AuthorizeUtil.AuthorizeTeacher, AssignmentAttemptCtrl.UpdateAssignmentAttemptMarks)

export default router