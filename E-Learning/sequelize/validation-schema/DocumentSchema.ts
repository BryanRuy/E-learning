import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const DocumentSchema = Joi.object({

    name: Joi.string()
        .required()
        .error(new ValidationError("Please provide a document name")),

    fileType: Joi.string()
        .valid(...[
            '.png',
            '.jpeg',
            '.jpg',
        ])
        .required()
        .error(new ValidationError("Invalid file type"))

})
