import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const AttemptUpdateSchema = Joi.object({

    attemptId: Joi.string().uuid()
        .required()
        .error(new ValidationError("attemptId is required")),

    questions: Joi.array()
        .items(Joi.object({

            type: Joi.number()
                .error(new ValidationError("%s is required", "type")),

            questionId: Joi.string().uuid()
                .error(new ValidationError("%s is required", "questionId")),

            answerText: Joi.string()
                .when("type", {
                    is: "2",
                    then: Joi.required(),
                })
                .error(new ValidationError("%s is required", "answerText")),

            optionId: Joi.string().uuid()
                .when("type", {
                    is: "1",
                    then: Joi.required(),
                })
                .error(new ValidationError("please select an option")),

        }))
        .min(1)


})
