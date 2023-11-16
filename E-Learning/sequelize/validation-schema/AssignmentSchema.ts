import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const AssignmentSchema = Joi.object({

    title: Joi.string()
        .required()
        .error(new ValidationError("Assignment title is required")),

    totalMarks: Joi.number()
        .required()
        .error(new ValidationError("Total marks is required")),


    content: Joi.string()
        .required()
        .error(new ValidationError("Add content for the assignment")),

    type: Joi.string()
        .valid(...[
            'coding',
            'theoretical',
        ])
        .required()
        .error(new ValidationError("Assignment type is required")),

    assignmentId: Joi.string().uuid().optional()

})

