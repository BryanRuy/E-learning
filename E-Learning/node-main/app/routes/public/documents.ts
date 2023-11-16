'use strict'
import express from "express";
import { AuthorizeUtil } from "../../../sequelize/middlewares/auth/auth";
import { DocumentCTRL } from "../../controllers/users"
import multer from "multer"
import { UUID_REGEX_ROUTE } from "../../../sequelize/utils/validators";

var upload = multer()

const router = express.Router();

router.post('/', AuthorizeUtil.AuthorizeUser, upload.single('file'), DocumentCTRL.SaveDocument)
router.get('/', AuthorizeUtil.AuthorizeUser, DocumentCTRL.GetUserDocuments)
router.delete(`/:documentId(${UUID_REGEX_ROUTE})`, AuthorizeUtil.AuthorizeUser, DocumentCTRL.DeleteDocument)

export const adminRoutes = router