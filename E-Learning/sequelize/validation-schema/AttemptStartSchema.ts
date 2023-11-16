import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const AttemptStartSchema = Joi.object({

    studentId: Joi.number()
        .required()
        .error(new ValidationError("studentId is required")),

    studentTestId: Joi.string().uuid()
        .required()
        .error(new ValidationError("studentTestId is required")),

})

