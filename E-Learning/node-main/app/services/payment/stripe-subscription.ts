import Stripe from "stripe";
import _ from "lodash";
import { PaymentIntentParams } from "./payment-types";
import {
  ApplicationError,
  BadRequestError,
} from "../../../sequelize/utils/errors";
import { User } from "../../../sequelize";
import { a } from "../../../sequelize/locales";

export class StripeCharges {
  private stripeAccount: Stripe;
  private stripeCustomer: Stripe.Customer;
  private user: User;
  constructor(
    stripeAccount: Stripe,
    stripeCustomer: Stripe.Customer,
    user: User
  ) {
    this.stripeAccount = stripeAccount;
    this.stripeCustomer = stripeCustomer;
    this.user = user;
  }

  async getCharges(type: "subscription" | "ebook") {
    let charges: Stripe.PaymentIntent[] = [];
    let starting_after;
    do {
      var chargeList: any = await this.stripeAccount.paymentIntents.list({
        customer: this.stripeCustomer.id,
        limit: 100,
        starting_after,
      });

      charges = [
        ...charges,
        ...chargeList.data.filter(
          (charge: any) => charge.metadata?.object === type
        ),
      ];
      if (chargeList.data[chargeList.data.length - 1])
        starting_after = chargeList.data[chargeList.data.length - 1].id;
    } while (chargeList.has_more);

    return charges;
  }

  async charge(params: PaymentIntentParams, chargeMetadata: any) {
    try {
      if (!params.card.id)
        throw new ApplicationError(
          ...a("SourceId is missing from Card while trying to make charge")
        );

      //! Stripe only allows 2.0RON or 0.5USD to be charged
      //! If charge amount is lower than that, it throws an Exception
      if (params.priceInCents < 200)
        throw new ApplicationError(
          ...a("Price charged cannot be less than 2.0 RON")
        );

      if (
        !this.user.zipCode ||
        !this.user.city ||
        !this.user.county ||
        !this.user.country
      ) {
        throw new BadRequestError(
          ...a(
            'Adauga adresa in contul tau, da click pe poza din dreapta sus, de langa numele tau, selecteaza "Profil", apoi "General". Revino pe aceasta sectiune dupa ce ai completat adresa.'
          )
        );
      }

      // - This Metadata helps identify each charge
      let paymentIntent = await this.stripeAccount.paymentIntents.create({
        amount: params.priceInCents,
        payment_method_types: ["card"],
        currency: params.currencyCode,
        customer: this.stripeCustomer.id,
        payment_method: params.card.id,
        off_session: true,
        confirm: true,
        shipping: {
          name: this.user.name,
          address: {
            postal_code: this.user.zipCode,
            city: this.user.city,
            state: this.user.county,
            country: this.user.country,
          },
        },
        metadata: chargeMetadata,
      });

      return {
        succeeded: true,
        client_secret: paymentIntent.client_secret,
      };
    } catch (err: any) {
      if (err instanceof BadRequestError) {
        throw err;
      }
      if (err.code === "authentication_required") {
        return {
          error: "authentication_required",
          paymentMethod: err.raw.payment_method.id,
          payment_method_types: ["card"],
          client_secret: err.raw.payment_intent.client_secret,
          amount: params.priceInCents,
          card: {
            brand: err.raw.payment_method.card.brand,
            last4: err.raw.payment_method.card.last4,
          },
        };
      } else if (err.code) {
        return {
          error: err.code,
        };
      } else {
        console.log("Unknown error occurred", err);
      }
    }
  }
}
