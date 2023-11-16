import Stripe from 'stripe';
import { User } from '../../../sequelize';
import { a } from '../../../sequelize/locales';
import { ApplicationError } from '../../../sequelize/utils/errors';


export class StripeCustomerUtil {

    private stripeAccount: Stripe

    constructor(stripeAccount: Stripe) {
        this.stripeAccount = stripeAccount;
    }

    async init(user: User, token?: string): Promise<Stripe.Customer> {
        let customer = await this.getCustomer(user.userId);

        if (!customer) {
            customer = await this.createCustomer(user, token);
        }
        
        if (customer.deleted) {
            throw new ApplicationError(...a('Customer has been deleted from Stripe'));
        }

        return customer;
    }

    private async getCustomer(userId: string) {
        try {
            let customer = await this.stripeAccount.customers.retrieve(userId);
            return customer.deleted
                ? customer as Stripe.DeletedCustomer
                : customer as Stripe.Customer
        } catch (error) {
            return undefined;
        }
    }

    private async createCustomer(user: User, token?: string) {
        let stripeCustomer = await this.stripeAccount.customers.create({
            id: user.userId,
            email: user.email,
            name: user.name,
            source: token
        } as any);

        return stripeCustomer as Stripe.Customer;
    }

}