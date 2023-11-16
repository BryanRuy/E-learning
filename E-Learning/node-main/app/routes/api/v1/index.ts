

'use strict'

import express from 'express'
import AdminRouter from './admin'
import StudentRouter from './student'
import UserRouter from './user'
import TeacherRouter from './teacher'
import TestRouter from './test'
import AttemptRouter from './attempt'
import StrapiRouter from './strapi'
import SuperAdminRouter from './super-admin'
import AssignmentRouter from './assignment'
import AssignmentAttemptRouter from './assignment-attempt'
import StudentTeacherHistoryRouter from './student-teacher-history'
import OsTicketRouter from './osticket'
import EBookRouter from './ebook'
import StripeRouter from './stripe'

const router = express.Router()

router.use('/super-admin', SuperAdminRouter)
router.use('/admins', AdminRouter)
router.use('/teachers', TeacherRouter)
router.use('/students', StudentRouter)
router.use('/users', UserRouter)
router.use('/tests', TestRouter)
router.use('/attempts', AttemptRouter)
router.use('/strapi', StrapiRouter)
router.use('/assignments', AssignmentRouter)
router.use('/assignment-attempts', AssignmentAttemptRouter)
router.use('/student-teacher-history', StudentTeacherHistoryRouter)
router.use('/osticket', OsTicketRouter)
router.use('/ebooks', EBookRouter)
router.use('/stripe', StripeRouter)

export const apiV1Routes = router
