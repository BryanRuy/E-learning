import Stripe from 'stripe';
import GlobalConfigurations from '../../../configs';

export const GetStripeAccount = (stripeAccount?: { publicKey: string, secretKey: string, apiVersion: string }) => {
    let account = stripeAccount ?? GlobalConfigurations?.StripeAccounts.RO!
    let stripe = new Stripe(account.secretKey, { apiVersion: account.apiVersion as any })
    return stripe
}

