import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const UserPasswordSchema = Joi.object({

    password: Joi
        .string()
        .min(4)
        .max(30)
        .required()
        .error(new ValidationError("Password must be between 8-30 characters")),

    confirmPassword: Joi.ref('password'),

    token: Joi
    .string()
    .optional()

}).with('password', 'confirmPassword');
