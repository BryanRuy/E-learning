import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const AssignTestSchema = Joi.object({

    studentId: Joi.string().uuid()
        .required()
        .error(new ValidationError("studentId is required")),

    testId: Joi.string().uuid()
        .required()
        .error(new ValidationError("testId is required")),

    startTime: Joi.string()
        .required()
        .error(new ValidationError("test start time is required")),

    endTime: Joi.string()
        .required()
        .error(new ValidationError("test end time is required")),

})

