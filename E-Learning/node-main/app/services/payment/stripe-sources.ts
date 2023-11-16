import _ from "lodash";
import Stripe from "stripe";
import { a } from "../../../sequelize/locales";
import { BadRequestError, NotFoundError } from "../../../sequelize/utils/errors";
import { StripeCard } from "./payment-types";

export class StripeSources{

    constructor(
        private stripeAccount: Stripe,
        private stripeCustomer: Stripe.Customer) {}

    async getUserDefaultCard() {
        let defaultSource;
        let source: Stripe.PaymentMethod ;
        let customer = this.stripeCustomer;
        
        if (customer.invoice_settings.default_payment_method) {
            source = typeof customer.invoice_settings.default_payment_method === 'string'
                ? (await this.stripeAccount
                    .paymentMethods
                    .retrieve(
                        customer.invoice_settings.default_payment_method
                    )
                )
                : customer.invoice_settings.default_payment_method

                
            defaultSource = source.object === 'payment_method'
                ? source
                : undefined;
        }
        
        return defaultSource;
    }

    filterCardSource(source: Stripe.PaymentMethod, getSourceId = false, isDefaultSource = false) {
        let card = source.card
        return {
            "id": getSourceId ? source.id : undefined,
            "exp_month": card!.exp_month,
            "exp_year": card!.exp_year,
            "last4": card!.last4,
            "mask": `•••• •••• •••• ${card!.last4}`,
            "type": card!.brand.toLowerCase(),
            "brand": card!.brand,
            "default": isDefaultSource,
            "fingerprint": card!.fingerprint!
        }
    }

    async setDefaultCard(fingerprint: string, getSourceId = false) {
        let cards = await this.getUserCards(true);
        let card = cards.find(x => x.fingerprint === fingerprint);
        
        if (card) {
            let paymentMethod = await this.stripeAccount.paymentMethods.update(card?.id!);
            let customer = await this
                .stripeAccount
                .customers
                .update(this.stripeCustomer.id, {
                    invoice_settings: {default_payment_method:paymentMethod.id}
                })
                return getSourceId ? card : _.omit(card, ['id']);
        }

        throw new BadRequestError(...a('Cannot set this card as your default payment source'));
    }

    async getUserCards(getSourceId = false) {

        let cards: StripeCard[] = [];
        let hasMore = true;
        let defaultCard = await this.getUserDefaultCard();

        while (hasMore) {
          
            let pmList = await this.stripeAccount.paymentMethods.list({customer:this.stripeCustomer.id,type:'card' ,limit:100})
            for(let pm of pmList.data){
                cards.push(this.filterCardSource(pm, getSourceId, pm.id === defaultCard?.id));
            }

            // let cardsPage = await this.stripeAccount.customers.listSources(
            //     this.stripeCustomer.id,
            //     { object: 'card', limit: 100 }
            // );
            // for (let source of cardsPage.data!) {
            //     if (source.object === 'card') {
            //         cards.push(this.filterCardSource(source, getSourceId, source.id === defaultCard?.id));
            //     }
            // }

            hasMore = pmList.has_more;
        }

        return cards;
    }

    async getUserPaymentMethods(getSourceId = false) {

        let PaymentMethods: Stripe.PaymentMethod[] = [];
        let hasMore = true;

        while (hasMore) {
          
            let pmList = await this.stripeAccount.paymentMethods.list({customer:this.stripeCustomer.id,type:'card' ,limit:100})
            for(let pm of pmList.data){
                PaymentMethods.push(pm);
            }

            hasMore = pmList.has_more;
        }

        return PaymentMethods;
    }


    private async isCardAlreadyAdded(card: Stripe.PaymentMethod.Card) {
        let cards = await this.getUserCards();
        return cards.map(c => c.fingerprint).indexOf(card.fingerprint!) > -1
    }

    async detachSource(fingerprint: string): Promise<Stripe.DeletedCard> {
        let paymentMethods = await this.getUserPaymentMethods(true)
        let paymentMethod = paymentMethods.find(e => {
            if(e.card?.fingerprint == fingerprint){ return e }
        })
        if (paymentMethod) {
          let deletedCard = await this.stripeAccount.paymentMethods.detach(
            paymentMethod.id!
          ) as any
          return deletedCard.card as Stripe.DeletedCard;
        }
        // let cards = await this.getUserCards(true);
        // let card = cards.find(x => x.fingerprint === fingerprint);
        // if (card) {
        //      let deletedCard = await this.stripeAccount.customers.deleteSource(this.stripeCustomer.id, card.id!);
        //     return deletedCard as Stripe.DeletedCard;
        // }
        throw new NotFoundError(...a('Card not found'))
    }

    async attachNewSource(token: string) {
        // let tokenObject = await this.stripeAccount.tokens.retrieve(token);
        let tokenObject = await this.stripeAccount.paymentMethods.retrieve(token);
        console.log("TOKEN OBJECT ==>", tokenObject);
        
        if (tokenObject.card) {
            let cardAdded = await this.isCardAlreadyAdded(tokenObject.card);
            if (cardAdded) {
                return tokenObject 
            }
            //  let newSourceOLD = await this.stripeAccount.sources.create(this.stripeCustomer.id, { source: token });
            // let newSource = await this.stripeAccount.paymentMethods.create( {type: 'card',
            // card: {
            //   number: '400000000003063',
            //   exp_month: 11,
            //   exp_year: 2022,
            //   cvc: '314',
            // },})
            let newSource = await this.stripeAccount.paymentMethods.attach(token,{customer:this.stripeCustomer.id})
            await this.setDefaultCard(newSource.card?.fingerprint!,false)
            
            // create( {customer:this.stripeCustomer.id,card:{token}})
            if (newSource.object === 'payment_method') {
                return newSource as Stripe.PaymentMethod
             }
        }
        throw new BadRequestError(...a('You can only attach Debit/Credit cards as payment methods'));
    }
}