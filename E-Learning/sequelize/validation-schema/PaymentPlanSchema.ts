import Joi from 'joi';
import { JoiType } from '../types/JoiType';
import { ValidationError } from '../utils/errors';

export type PaymentPlanNewSchemaType = {
    userId: string
    price: number
    priceInCents: number
    currencyCode: 'RON' | 'USD',
    planDurationInDays: number
    planDuration: string
    planTerm: 'monthly' | 'yearly'
}

export type PaymentPlanUpdateSchemaType = {
    userId: string
    paymentPlanId: string
    price: number
    priceInCents: number
    currencyCode: 'RON' | 'USD',
    planDurationInDays: number
    planDuration: string
    planTerm: 'monthly' | 'yearly'
}

export const PaymentPlanNewSchema = JoiType({

    userId: Joi
        .string()
        .uuid()
        .required()
        .error(new ValidationError("userId is required")),

    price: Joi.number()
        .required()
        .min(2)
        .max(500)
        .error(new ValidationError("price is required and must be between 2-500RON")),

    currencyCode: Joi.string().valid('RON', 'USD'),

    planDurationInDays: Joi.number()
        .required()
        .valid(7, 30, 90)
        .error(new ValidationError("planDurationInDays is required and must be between 7-90 days.")),

    planDuration: Joi
        .string()
        .required()
        .valid('1 Week', '1 Month', '3 Months')
        .error(new ValidationError("planDuration must be 1 Week, 1 Month, or 3 Months")),

    planTerm: Joi
        .string()
        .required()
        .valid('monthly', 'yearly')
        .error(new ValidationError("planTerm must be either yearly or monthly")),
})

export const PaymentPlanUpdateSchema = JoiType({

    userId: Joi
        .string()
        .uuid()
        .required()
        .error(new ValidationError("userId is required")),

    paymentPlanId: Joi
        .string()
        .uuid()
        .required()
        .error(new ValidationError("paymentPlanId is not defined")),

    price: Joi.number()
        .required()
        .min(2)
        .max(500)
        .error(new ValidationError("price is required and must be between 2-500RON")),

    currencyCode: Joi.string().valid('RON', 'USD'),

    planDurationInDays: Joi.number()
        .required()
        .valid(7, 30, 90)
        .error(new ValidationError("planDurationInDays is required and must be between 7-90 days.")),

    planDuration: Joi
        .string()
        .required()
        .valid('1 Week', '1 Month', '3 Months')
        .error(new ValidationError("planDuration must be 1 Week, 1 Month, or 3 Months")),

    planTerm: Joi
        .string()
        .required()
        .valid('monthly', 'yearly')
        .error(new ValidationError("planTerm must be either yearly or monthly")),
})
