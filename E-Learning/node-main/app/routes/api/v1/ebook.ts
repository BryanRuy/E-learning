'use strict'

import express from 'express'
import * as  EbookCtrl from '../../../controllers/ebook'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import multer from 'multer';

const upload = multer();
const router = express.Router()
router.get('/', AuthorizeUtil.AuthorizeUser, EbookCtrl.GetEbooks)
router.post('/', AuthorizeUtil.AuthorizeAdmin, upload.any(), EbookCtrl.CreateEbook)
router.put('/', AuthorizeUtil.AuthorizeAdmin, upload.any(), EbookCtrl.UpdateEbook)
router.get('/download/:ebookId/:token?', AuthorizeUtil.AuthorizeUser, EbookCtrl.BuyEbook, EbookCtrl.GetEbookContent)
// router.delete('/', AuthorizeUtil.AuthorizeAdmin, upload.any(), EbookCtrl.DeleteEbooks)


export default router
