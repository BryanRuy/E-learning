
'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as StudentTeacherHistoryCtrl from '../../../controllers/student-teacher-history'
import multer from 'multer';

const upload = multer();

const router = express.Router()

router.get('/:selectedUserId?', AuthorizeUtil.AuthorizeUser, StudentTeacherHistoryCtrl.GetStudentTeacherHistory)


export default router