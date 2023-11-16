import { PaymentPlan, User } from "../../../sequelize";
import Stripe from "stripe";
import {
  PaymentIntentParams,
  PaymentPlanActivateParams,
  PaymentPlanConstructorParams,
  PaymentPlanCreateParams,
} from "./payment-types";
import {
  ApplicationError,
  BadRequestError,
} from "../../../sequelize/utils/errors";
import { StripeCustomerUtil } from "./stripe-customer";
import { StripeCharges } from "./stripe-subscription";
import moment from "moment";
import { SequelizeAttributes } from "../../../sequelize/types";
import { Logger } from "../../../sequelize/utils/logger";
import { a } from "../../../sequelize/locales";
import { SmartBilling } from "./smart-billing";
import { StripeSources } from "./stripe-sources";
import { GetStripeAccount } from "./stripe-account";
import _ from "lodash";
export class PaymentPlansUtil {
  charges: StripeCharges;
  private user: User;
  sources: StripeSources;

  private constructor(initializer: PaymentPlanConstructorParams) {
    this.charges = initializer.stripeCharges;
    this.user = initializer.user;
    this.sources = initializer.sources;
  }

  static async init(customerId: string, stripeAccount: Stripe) {
    let user = await User.findOne({ where: { userId: customerId } });
    if (!user) {
      throw new ApplicationError(...a("User does not exist."));
    }

    let customer = await new StripeCustomerUtil(stripeAccount).init(user);
    let stripeCharges = new StripeCharges(stripeAccount, customer, user);
    let sources = new StripeSources(stripeAccount, customer);
    return new PaymentPlansUtil({
      user,
      stripeCharges,
      stripeAccount,
      sources,
    });
  }

  static async getExpiringSubscriptions(
    expiringInDays = 0
  ): Promise<PaymentPlan[]> {
    let endDate = moment(new Date())
      .set({ h: 0, m: 0, s: 0 })
      .add(expiringInDays, "days")
      .format("YYYY-MM-DD");

    return PaymentPlan.findAll({
      include: [User],
      where: {
        status: "active",
        endDate,
      },
    });
  }

  async getPaymentPlan(returnSafeColumns = false) {
    let find = {
      where: { userId: this.user._userId },
    };
    return returnSafeColumns
      ? PaymentPlan.findOneSafe<PaymentPlan>(
          SequelizeAttributes.WithoutIndexes,
          find
        )
      : PaymentPlan.findOne(find);
  }

  async updatePaymentPlan(plan: PaymentPlan) {
    let [affectedRows, updated] = await PaymentPlan.update(plan, {
      where: { paymentPlanId: plan.paymentPlanId },
    });
    let updatedPlan = await this.getPaymentPlan();
    return updatedPlan!;
  }

  async createPlan(plan: PaymentPlanCreateParams) {
    let paymentPlan = await this.getPaymentPlan();
    let updatedPaymentPlan: PaymentPlan;

    if (paymentPlan) {
      updatedPaymentPlan = await this.updatePaymentPlan({
        ...plan,
        paymentPlanId: paymentPlan.paymentPlanId,
      } as any);
    } else {
      updatedPaymentPlan = await PaymentPlan.create({
        ...plan,
        userId: this.user._userId!,
      } as any);
    }

    return updatedPaymentPlan;
  }

  async isSubscriptionPaid(
    planActivate: PaymentPlanActivateParams
  ): Promise<boolean> {
    let plan = await this.getPaymentPlan();

    if (!plan) {
      throw new ApplicationError(...a("No payment plan is set for the user"));
    }

    let charges = await this.charges.getCharges("subscription");
    let startDate = moment(planActivate.startDate).format("YYYY-MM-DD");
    let endDate = moment(planActivate.endDate).format("YYYY-MM-DD");

    let { paymentPlanId } = plan;

    for (let charge of charges) {
      if (
        charge.metadata.paymentPlanId == paymentPlanId &&
        charge.metadata.userId == this.user.userId &&
        charge.metadata.startDate == startDate &&
        charge.metadata.endDate == endDate
      ) {
        return true;
      }
    }

    return false;
  }

  private async updateSubscription(planActivate: PaymentPlan) {
    let [affectedRows, updated] = await PaymentPlan.update(
      {
        startDate: planActivate.startDate,
        endDate: planActivate.endDate,
        status: planActivate.status,
      },
      { where: { userId: this.user._userId! } }
    );

    return this.getPaymentPlan();
  }

  async deactivatePlan() {
    let [affectedRows, updated] = await PaymentPlan.update(
      { status: "deactivated" },
      { where: { userId: this.user._userId } }
    );

    return this.getPaymentPlan();
  }

  async updateSubscriptionLocally(
    plan: PaymentPlan,
    planActivate: PaymentPlanActivateParams
  ) {
    let updatedPlan = await this.updateSubscription({
      ...planActivate,
      status: "active",
    } as any);
    Logger.info(`User ${this.user.userId} subcription is already paid`);
    return { data: updatedPlan, status: "succeeded" };
  }

  async activatePlan(planActivate: PaymentPlanActivateParams) {
    if (
      !this.user.address ||
      !this.user.city ||
      !this.user.country ||
      !this.user.county
    ) {
      throw new BadRequestError(
        ...a(
          "Actualizeaza adresa de pe profilul tau, acest lucru este necesar pentru a putea trimite factura."
        )
      );
    }

    let plan = await this.getPaymentPlan();
    if (!plan) {
      throw new ApplicationError(...a("No payment plan is set for the user"));
    }

    let isPaidAlready = await this.isSubscriptionPaid(planActivate);
    if (isPaidAlready) {
      return this.updateSubscriptionLocally(plan, planActivate);
    }

    // - This Metadata helps identify each charge
    let chargeMetadata = {
      object: "subscription",
      userId: this.user!.userId,
      startDate: moment(planActivate.startDate).format("YYYY-MM-DD"),
      endDate: moment(planActivate.endDate).format("YYYY-MM-DD"),
      ..._.pick(plan, ["paymentPlanId", "planTerm"]),
    };

    let PaymentIntentParams: PaymentIntentParams = {
      card: planActivate.source,
      price: plan.price,
      priceInCents: plan.priceInCents,
      currencyCode: plan.currencyCode,
    };

    let charge = await this.charges.charge(PaymentIntentParams, chargeMetadata);
    //- Charge.succeeded is only true if payment in full has been deducted
    if (charge?.succeeded) {
      Logger.info(`User ${this.user.userId} payment is successful`);
      return this.updateSubscriptionLocally(plan, planActivate);
    } else if (charge?.error == "authentication_required") {
      return { data: charge, status: "authentication_required" };
    } else {
      await this.deactivatePlan();
      throw new BadRequestError(
        ...a("Payment has been failed. Please try again")
      );
    }
  }

  async confirmPaymentPlan(paymentIntentObject: any) {
    let plan = await this.getPaymentPlan();
    if (!plan) {
      throw new ApplicationError(...a("No payment plan is set for the user"));
    }
    if (paymentIntentObject.paymentPlanId == plan.paymentPlanId) {
      let { startDate, endDate } = paymentIntentObject;
      Logger.info(`User ${this.user.userId} payment is successful`);
      let updatedPlan = await this.updateSubscription({
        startDate,
        endDate,
        status: "active",
      } as any);

      let smartInvoice = await SmartBilling.sendInvoice({
        user: this.user,
        plan: plan,
        issueDate: new Date(),
      });

      return { data: updatedPlan, status: "succeeded" };
    } else {
      throw new BadRequestError(
        ...a("Payment has failed. Please try again")
      );
    }
  }
}
