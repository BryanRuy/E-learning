'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as AdminCTRL from '../../../controllers/admin'

import * as TeacherCtrl from "../../../controllers/teacher"
import * as PaymentCtrl from "../../../controllers/payment"
import * as StudentCtrl from "../../../controllers/student"
import * as AdminDashboardCtrl from "../../../controllers/dashboard/admin-dashboard"
import {AdminProfileCtrl} from '../../../controllers/profile'
import multer from "multer"
import { UUID_REGEX_ROUTE } from '../../../../sequelize/utils/validators'

var upload = multer()

const router = express.Router()


router.get(`/`, AuthorizeUtil.AuthorizeSuperAdmin, AdminCTRL.GetAdmins)
router.get(`/dashboard`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.AdminDashboard)
router.get(`/yearly-signup-users/:year`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetYearlySignUpUserCount)
router.get(`/teacher-stats`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetTeacherStats)
router.get(`/student-stats`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetStudentStats)
router.get(`/teacher-history-stats/:teacherId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetTeacherHistoryStats)
router.get(`/student-history-stats/:studentId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetStudentHistoryStats)
router.get(`/students-by-status`, AuthorizeUtil.AuthorizeAdmin, AdminDashboardCtrl.GetStudentsByStatus)

router.get(`/teachers`, AuthorizeUtil.AuthorizeAdmin, TeacherCtrl.GetAllTeachers)
router.get(`/teachers/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, TeacherCtrl.GetTeacher)
router.put(`/teachers/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, TeacherCtrl.UpdateTeacherStatus)

router.get(`/teachers/:userId(${UUID_REGEX_ROUTE})/payment-plan`, AuthorizeUtil.AuthorizeAdmin, PaymentCtrl.GetPaymentPlan)
router.post(`/teachers/:userId(${UUID_REGEX_ROUTE})/payment-plan`, AuthorizeUtil.AuthorizeAdmin, PaymentCtrl.CreateNewPaymentPlan)
router.put(`/teachers/:userId(${UUID_REGEX_ROUTE})/payment-plan`, AuthorizeUtil.AuthorizeAdmin, PaymentCtrl.UpdatePaymentPlan)

router.get(`/students`, AuthorizeUtil.AuthorizeAdmin, StudentCtrl.GetActiveStudents)
router.get(`/students/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, StudentCtrl.GetStudent)
router.put(`/students/:userId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeAdmin, StudentCtrl.UpdateStudentStatus)

router.post('/assign', AuthorizeUtil.AuthorizeAdmin, AdminCTRL.AssignTeacherToStudent)
router.put('/assign', AuthorizeUtil.AuthorizeAdmin, AdminCTRL.UnassignTeacher)


router.post(`/:userId(${UUID_REGEX_ROUTE})/profile-picture`, AuthorizeUtil.AuthorizeUser, upload.single('file'), AdminProfileCtrl.UpdateProfilePicture)
router.put(`/:userId(${UUID_REGEX_ROUTE})/profile`, AuthorizeUtil.AuthorizeUser, AdminProfileCtrl.UpdateBasicInfo)
router.put(`/:userId(${UUID_REGEX_ROUTE})/password`, AuthorizeUtil.AuthorizeUser, AdminProfileCtrl.UpdatePassword)


// router.get(`/:userId`, AuthorizeUtil.AuthorizeAdmin, AdminCTRL.GetAdmin)
export default router
