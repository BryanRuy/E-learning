'use strict'
import express from "express";
import { AuthorizeUtil } from "../../../sequelize/middlewares/auth/auth";
import { DocumentCTRL } from "../../controllers/users"
import multer from "multer"

var upload = multer()

const router = express.Router();


// router.post('/:userId/profile-picture', AuthorizeUtil.AuthorizeUser, upload.single('file'), ProfileCTRL.UpdateProfilePicture)
// router.put('/:userId/profile', AuthorizeUtil.AuthorizeUser, ProfileCTRL.UpdateBasicInfo)
// router.put('/:userId/password', AuthorizeUtil.AuthorizeUser, ProfileCTRL.UpdatePassword)

export const userRoutes = router