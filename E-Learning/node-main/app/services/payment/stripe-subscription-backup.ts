import { PaymentPlan } from "../../../sequelize"
import Stripe from 'stripe'
import _ from 'lodash';
import { PaymentPlanActivateParams, StripeCard } from "./payment-types";
import { ApplicationError, BadRequestError } from "../../../sequelize/utils/errors";
import moment from 'moment';
import { Logger } from "../../../sequelize/utils/logger";
import { User } from "../../../sequelize";
import { a } from "../../../sequelize/locales";


export class StripeSubscription {

    private stripeAccount: Stripe
    private stripeCustomer: Stripe.Customer
    private user: User
    constructor(stripeAccount: Stripe, stripeCustomer: Stripe.Customer, user: User) {
        this.stripeAccount = stripeAccount;
        this.stripeCustomer = stripeCustomer;
        this.user = user;
    }

    async getCharges() {
        let charges: Stripe.Charge[] = [];
        do {
            var chargeList = await this.stripeAccount.charges.list({
                customer: this.stripeCustomer.id,
                limit: 100
            });

            charges = [...charges, ...chargeList.data];
        }
        while (chargeList.has_more);

        return charges;
    }

    async charge(planActivate: PaymentPlanActivateParams, plan: PaymentPlan) {

        if (!planActivate.source.id)
            throw new ApplicationError(...a('SourceId is missing from Card while trying to make charge'));

        //! Stripe only allows 2.0RON or 0.5USD to be charged
        //! If charge amount is lower than that, it throws an Exception
        if (plan.priceInCents < 200)
            throw new ApplicationError(...a('Price charged cannot be less than 2.0 RON'));

        // - This Metadata helps identify each charge
        let planMetadata = {
            ..._.pick(plan, ['paymentPlanId', 'planTerm']),
            userId: this.user!.userId,
            startDate: moment(planActivate.startDate).format("YYYY-MM-DD"),
            endDate: moment(planActivate.endDate).format("YYYY-MM-DD")
        }

        //- If charge has been created for this Subscription already
        //- Probably last transaction failed to update the plan
        //- Update the plan and return



        //- Proceed to create a Charge on Customer account
        
        let charge = await this.stripeAccount.charges.create({
            customer: this.stripeCustomer.id,
            source: planActivate.source.id,
            amount: plan.priceInCents,
            currency: plan.currencyCode,
            metadata: planMetadata as any
        })

        return charge;

    }

}