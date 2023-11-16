import Stripe from "stripe";
import { Ebook, User } from "../../../sequelize";
import { a } from "../../../sequelize/locales";
import { EbookPurchase } from "../../../sequelize/models/EbookPurchase";
import { SequelizeAttributes } from "../../../sequelize/types";
import {
  BadRequestError,
  NotFoundError,
} from "../../../sequelize/utils/errors";
import { GetStripeAccount } from "./stripe-account";
import { StripeCustomerUtil } from "./stripe-customer";
import { StripeSources } from "./stripe-sources";
import _ from "lodash";
import { StripeCharges } from "./stripe-subscription";
import { PaymentIntentParams } from "./payment-types";
import { Logger } from "../../../sequelize/utils/logger";
import { or } from "../../../sequelize/node_modules/sequelize/types";
import { SmartBilling } from "./smart-billing";

export class EbookPayments {
  private stripeAccount: Stripe;
  private stripeCustomer: Stripe.Customer;
  private user: User;
  private sources: StripeSources;
  charges: StripeCharges;

  private constructor(
    stripeAccount: Stripe,
    stripeCustomer: Stripe.Customer,
    user: User,
    charges: StripeCharges
  ) {
    this.stripeAccount = stripeAccount;
    this.stripeCustomer = stripeCustomer;
    this.user = user;
    this.charges = charges;
    this.sources = new StripeSources(stripeAccount, stripeCustomer);
  }

  static async init(userId: string): Promise<EbookPayments> {
    let user = await User.findOne({
      where: {
        userId,
      },
    });
    if (!user) throw new NotFoundError(`User not found.`);

    let stripeAccount = GetStripeAccount();
    let customerUtil = new StripeCustomerUtil(stripeAccount);
    let customer = await customerUtil.init(user);
    let charges = new StripeCharges(stripeAccount, customer, user);

    return new EbookPayments(stripeAccount, customer, user, charges);
  }

  async getPurchaseHistory() {
    return EbookPurchase.findAllSafe<EbookPurchase[]>(
      SequelizeAttributes.WithoutIndexes,
      {
        where: {
          userId: this.user._userId,
        },
      }
    );
  }

  async getEbook(ebookId: string) {
    let book = await Ebook.findOneSafe<Ebook>(SequelizeAttributes.WithIndexes, {
      where: { ebookId },
    });

    if (!book) throw new NotFoundError(`Ebook not found.`);
    return book;
  }

  async hasPurchased(ebookId: string) {
    let book = await this.getEbook(ebookId);
    let charges = await this.charges.getCharges("ebook");
    
    for (let charge of charges) {
      if (
        charge.metadata.ebookId == ebookId &&
        charge.metadata.userId == this.user.userId as any
      ) {        
        return true;
      }
    }

    return false;
  }

  async purchase(ebookId: string, token?: string) {
    let ebook = await this.getEbook(ebookId);
    let hasUserPurchasedEbook = await this.hasPurchased(ebookId);

    let card = await (token
      ? this.sources.attachNewSource(token)
      : this.sources.getUserDefaultCard());

    if (!card)
      throw new BadRequestError(...a("Please add a new Card to your account"));

    if (hasUserPurchasedEbook) {
      let order = await this.updatePurchasedBookLocally(ebook._ebookId);
      return { data: order, status: "succeeded" };
    }
      // - This Metadata helps identify each charge
    let ebookMetadata = {
      userId: this.user.userId,
      object: "ebook",
      ..._.pick(ebook, ["_ebookId", "ebookId", "title", "ebook.price"]),
    };

    let paymentIntentParams: PaymentIntentParams = {
      card: card as any,
      price: ebook.price,
      priceInCents: ebook.priceInCents,
      currencyCode: "RON",
    };

    let purchased = await this.charges.charge(
      paymentIntentParams,
      ebookMetadata
    );
    
    if (purchased?.succeeded) {
      Logger.info(`User ${this.user.userId} ebook payment is successful`);
      let order = await this.updatePurchasedBookLocally(ebook._ebookId);
      return { data: order, status: "succeeded" };
    } else if (purchased?.error == "authentication_required") {
      return { data: purchased, status: "authentication_required" };
    } else {
      throw new BadRequestError(
        ...a("Payment has been failed. Please try again")
      );
    }
  }

  async updatePurchasedBookLocally(ebookId: number, sendInvoice: boolean = false) {
    
    let order = await EbookPurchase.findOrCreateSafe(
      SequelizeAttributes.WithoutIndexes,
      {
        defaults: {
          userId: this.user._userId!,
          ebookId: ebookId,
        } as any,
        where: { userId: this.user._userId, ebookId: ebookId },
      }
    );
    if (sendInvoice) {
      let ebook = await Ebook.findOneSafe<Ebook>(SequelizeAttributes.WithIndexes, {
        where: {
          _ebookId: ebookId,
        }
      })
  
      let smartInvoice = await SmartBilling.sendInvoice({
        user: this.user,
        ebook: ebook,
        issueDate: new Date(),
      });
    }
    return order;
  } 
}
