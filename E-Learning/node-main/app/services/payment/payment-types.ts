import Stripe from 'stripe';
import { User } from '../../../sequelize';
import { StripeSources } from './stripe-sources';
import { StripeCharges } from './stripe-subscription';

export type AvailableCurrency = 'RON' | 'USD';

export type PaymentPlanCreateParams = {
    price: number
    priceInCents: number
    currencyCode: AvailableCurrency
    planDurationInDays: number
    planDuration: string
    planTerm: 'monthly' | 'yearly'
}

export type PaymentPlanUpdateParams = {
    paymentPlanId: string
    price: number
    priceInCents: number
    currencyCode: AvailableCurrency
    planDurationInDays: number
    planDuration: string
    planTerm: 'monthly' | 'yearly'
}

export type PaymentPlanConstructorParams = {
    user: User
    stripeCharges: StripeCharges
    sources: StripeSources
    stripeAccount: Stripe
}

export type PaymentPlanActivateParams = {
    source: Stripe.Card
    startDate: Date
    endDate: Date
}

export type PaymentPlanDeactivateParams = {
    userId: string
}

export type StripeCard = {
    id?: string
    exp_month: number
    exp_year: number
    last4: string
    mask: string
    type: string
    brand: string
    fingerprint: string
    default: boolean | null | undefined
}


export type PaymentIntentParams = {
    card : Stripe.Card,
    price:number,
    priceInCents:number,
    currencyCode :string
}