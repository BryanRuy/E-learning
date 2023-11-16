import { NextFunction, request, Request, Response } from "express";
import { a } from "../../../sequelize/locales";
import {
    ApplicationError,
    BadRequestError,
    UnAuthorizedError,
} from "../../../sequelize/utils/errors";
import { DataResponse } from "../../../sequelize/utils/http-response";
import { PaymentPlansUtil } from "../../services/payment/payment-plans";
import { GetStripeAccount } from "../../services/payment/stripe-account";
import Stripe from "stripe";
import moment from "moment";
import _ from "lodash";
import { StripeCard } from "../../services/payment/payment-types";
import GlobalConfigurations from "../../../configs";
import {
    PaymentPlanNewSchema,
    PaymentPlanNewSchemaType,
    PaymentPlanUpdateSchema,
    PaymentPlanUpdateSchemaType,
} from "../../../sequelize/validation-schema";
import { EbookPayments } from "../../services/payment/ebook-payments";
import { SmartBilling } from "../../services/payment/smart-billing";

async function getPaymentPlan(req: Request) {
    let userId = req.CurrentUser?.userId;

    if (
        req.CurrentUser?.roleId === "admin" ||
        req.CurrentUser?.roleId === "super-admin"
    ) {
        userId = req.params.userId;
        if (!userId) {
            throw new BadRequestError(...a("userId is required"));
        }
    }

    if (!userId)
        throw new UnAuthorizedError(
            ...a(`You are not authorized to access this resource`)
        );

    let stripeAccount = GetStripeAccount();
    let paymentPlansUtil = await PaymentPlansUtil.init(userId, stripeAccount);
    // Only return safe columns to User
    let paymentPlan = await paymentPlansUtil.getPaymentPlan(true);

    return { paymentPlansUtil, paymentPlan };
}

async function getPaymentSource(
    paymentPlansUtil: PaymentPlansUtil,
    token?: string
) {
    let source: Stripe.Card | undefined;
    source = (await (token
        ? paymentPlansUtil.sources.attachNewSource(token)
        : paymentPlansUtil.sources.getUserDefaultCard())) as any;

    return source;
}

export async function CreateNewPaymentPlan(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let plan: PaymentPlanNewSchemaType =
            await PaymentPlanNewSchema.validateAsync(req.body);
        let stripeAccount = GetStripeAccount();
        let planUtil = await PaymentPlansUtil.init(plan.userId, stripeAccount);
        plan.priceInCents = Math.floor(Number(plan.price) * 100);
        let newPlan = await planUtil.createPlan(_.omit(plan, "userId"));
        let planSafe = await planUtil.getPaymentPlan(false);
        return DataResponse(res, 200, planSafe);
    } catch (err) {
        next(err);
    }
}

export async function UpdatePaymentPlan(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let plan: PaymentPlanUpdateSchemaType =
            await PaymentPlanUpdateSchema.validateAsync(req.body);
        let stripeAccount = GetStripeAccount();
        let planUtil = await PaymentPlansUtil.init(plan.userId, stripeAccount);
        plan.priceInCents = Math.floor(Number(plan.price) * 100);

        let updatedPlan = await planUtil.updatePaymentPlan(
            _.omit(plan, "userId") as any
        );
        let planSafe = await planUtil.getPaymentPlan(false);

        return DataResponse(res, 200, planSafe);
    } catch (err) {
        next(err);
    }
}

export async function GetStripePublicKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { publicKey } = GlobalConfigurations!.StripeAccounts.RO;
        if (publicKey) {
            return DataResponse(res, 200, { publicKey });
        }
        throw new ApplicationError(...a("Stripe Public key is not set"));
    } catch (err) {
        next(err);
    }
}

export async function GetPaymentPlan(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { paymentPlan } = await getPaymentPlan(req);
        return DataResponse(res, 200, paymentPlan);
    } catch (err) {
        next(err);
    }
}

export async function GetMyCards(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req);
        let cards = await paymentPlansUtil.sources.getUserCards(false);

        return DataResponse(res, 200, cards);
    } catch (error) {
        next(error);
    }
}

export async function SetAsDefaultCard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req);
        let { fingerprint } = req.body;
        if (!fingerprint) {
            throw new BadRequestError(...a("Please select a card first"));
        }

        let card = await paymentPlansUtil.sources.setDefaultCard(fingerprint);

        return DataResponse(res, 200, card);
    } catch (error) {
        next(error);
    }
}

export async function AttachNewCard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { token } = req.body;

        if (!token) {
            throw new BadRequestError(
                ...a("Cannot add your card at the moment, please try again")
            );
        }

        let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req);
        let source = await paymentPlansUtil.sources.attachNewSource(token);
        let card: StripeCard = paymentPlansUtil.sources.filterCardSource(
            source,
            false
        );

        return DataResponse(res, 200, card);
    } catch (error) {
        next(error);
    }
}

export async function DettachCard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { fingerprint } = req.body;

        if (!fingerprint) {
            throw new BadRequestError(
                ...a("Cannot remove your card at the moment, please try again")
            );
        }

        let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req);
        let source = await paymentPlansUtil.sources.detachSource(fingerprint);

        return DataResponse(res, 200, { fingerprint });
    } catch (error) {
        next(error);
    }
}

// export async function PaySubscription(req: Request, res: Response, next: NextFunction) {
//     try {
//         let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req)

//         if (!paymentPlan) {
//             throw new BadRequestError(...a('Payment plan has not been set for your account'));
//         }

//         let source = await getPaymentSource(paymentPlansUtil, req.body?.token ?? undefined);
//         if (!source) {
//             throw new BadRequestError(...a('Please attach a Card before proceeding with payment'));
//         }

//         let currentDate = moment(new Date()).set({h:0, m: 0, s:0})

//         let paymentPlanActivate = {
//             source, // Stripe Source
//             startDate: currentDate.toDate(), // Current Date
//             // Current Date + Plan Duration to get Expiry
//             endDate: currentDate
//                 .add(paymentPlan.planDurationInDays, 'days')
//                 .toDate()
//         }

//         let activatedPlan = await paymentPlansUtil.activatePlan(paymentPlanActivate)

//         if (activatedPlan) {
//             return DataResponse(res, 200, paymentPlan)
//         }

//     } catch (err) {
//         next(err)
//     }
// }

export async function PaySubscriptionThreeDsSecure(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let { paymentPlansUtil, paymentPlan } = await getPaymentPlan(req);

        if (!paymentPlan) {
            throw new BadRequestError(
                ...a("Payment plan has not been set for your account")
            );
        }

        let source = await getPaymentSource(
            paymentPlansUtil,
            req.body?.token ?? undefined
        );
        if (!source) {
            throw new BadRequestError(
                ...a("Please attach a Card before proceeding with payment")
            );
        }

        let currentDate = moment(new Date()).set({ h: 0, m: 0, s: 0 });

        let paymentPlanActivate = {
            source, // Stripe Source
            startDate: currentDate.toDate(), // Current Date
            // Current Date + Plan Duration to get Expiry
            endDate: currentDate.add(paymentPlan.planDurationInDays, "days").toDate(),
        };

        let activatedPlan = await paymentPlansUtil.activatePlan(
            paymentPlanActivate
        );

        if (activatedPlan.status === "succeeded") {
            (paymentPlan as any).code = "succeeded";
            return DataResponse(res, 200, paymentPlan);
        } else if (activatedPlan.status === "authentication_required") {
            (activatedPlan.data as any).code = "authentication_required";
            return DataResponse(res, 200, activatedPlan.data);
        }
    } catch (err) {
        next(err);
    }
}

export async function StripeWebhookEvent(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const signature = req.headers["stripe-signature"] as any;
        let stripe = GetStripeAccount();

        let event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            GlobalConfigurations?.StripeAccounts.webhook_endpoint_secret!
        );

        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object as any;
                // Then define and call a function to handle the event payment_intent.succeeded

                if (paymentIntent.metadata.object == "subscription") {
                    let stripeAccount = GetStripeAccount();
                    let paymentPlansUtil = await PaymentPlansUtil.init(
                        paymentIntent.metadata.userId,
                        stripeAccount
                    );
                    // Only return safe columns to User
                    let paymentPlan = await paymentPlansUtil.getPaymentPlan(true);
                    if (!paymentPlan) {
                        throw new BadRequestError(
                            ...a("Payment plan has not been set for your account")
                        );
                    }

                    let activatedPlan = await paymentPlansUtil.confirmPaymentPlan(
                        paymentIntent.metadata
                    );
                    
                    DataResponse(res, 200, "Subscription plan updated successfully");
                } else if (paymentIntent.metadata.object == "ebook") {
                    let ebookPayment = await EbookPayments.init(
                        paymentIntent.metadata.userId
                    );
                    await ebookPayment.updatePurchasedBookLocally(
                        paymentIntent.metadata._ebookId,
                        true
                    );

                    DataResponse(res, 200, "Ebook purchased successfully");
                }
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
    } catch (err) {
        next(err);
    }
}
