import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const AssignTeacherSchema = Joi.object({

    studentId: Joi.string().uuid()
        .required()
        .error(new ValidationError("studentId is required")),

    teacherId: Joi.string().uuid()
        .required()
        .error(new ValidationError("teacherId is required")),

})

