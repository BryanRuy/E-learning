'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import * as OsTicketCtrl from '../../../controllers/osticket'

const router = express.Router()


router.post('/', AuthorizeUtil.AuthorizeUser, OsTicketCtrl.CreateOSTicket)

export default router
