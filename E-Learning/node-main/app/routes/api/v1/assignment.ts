'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'
import * as AssignmentCtrl from '../../../controllers/assignment'

const router = express.Router()

router.post(`/`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.CreateAssignments)
router.put(`/`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.UpdateAssignments)
router.get(`/`, AuthorizeUtil.AuthorizeUser, AssignmentCtrl.GetAssignments)
router.delete(`/:assignmentId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.DeleteAssignment)

router.post(`/:assignmentId(${UUID_REGEX_ROUTE})/assign`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.AssignAssignment)
router.delete(`/:assignmentId(${UUID_REGEX_ROUTE})/unassign`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.UnassignAssignment)

router.get(`/:assignmentId(${UUID_REGEX_ROUTE})/upcoming-assignments`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.GetUpcomingAssignments)
router.get(`/:assignmentId(${UUID_REGEX_ROUTE})/past-assignments`, AuthorizeUtil.AuthorizeTeacher, AssignmentCtrl.GetPastAssignments)

router.get(`/upcoming-assignments`, AuthorizeUtil.AuthorizeUser, AssignmentCtrl.GetUpcomingAllAssignments)
router.get(`/past-assignments`, AuthorizeUtil.AuthorizeUser, AssignmentCtrl.GetPastAllAssignments)

router.get(`/:assignmentId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, AssignmentCtrl.GetAssignment)
export default router