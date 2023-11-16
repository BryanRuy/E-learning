
'use strict'

import express from 'express'
import { AuthorizeUtil } from '../../../../sequelize/middlewares/auth/auth'
import { PaymentCtrl } from '../../../controllers/profile'

const router = express.Router()

router.get('/public-key', PaymentCtrl.GetStripePublicKey);
router.get('/payment-plan', AuthorizeUtil.AuthorizeTeacher, PaymentCtrl.GetPaymentPlan);
router.get('/payment-methods', AuthorizeUtil.AuthorizeUser, PaymentCtrl.GetMyCards);
router.post('/payment-methods', AuthorizeUtil.AuthorizeUser, PaymentCtrl.AttachNewCard);
router.delete('/payment-methods', AuthorizeUtil.AuthorizeUser, PaymentCtrl.DettachCard);
router.put('/payment-methods', AuthorizeUtil.AuthorizeUser, PaymentCtrl.SetAsDefaultCard);
// router.post('/pay', AuthorizeUtil.AuthorizeTeacher, PaymentCtrl.PaySubscription)
router.post('/pay', AuthorizeUtil.AuthorizeTeacher, PaymentCtrl.PaySubscriptionThreeDsSecure)


export default router