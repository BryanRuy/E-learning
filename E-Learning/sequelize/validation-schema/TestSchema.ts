import Joi from 'joi';
import { max } from 'lodash';
import { ValidationError } from '../utils/errors';

export const TestSchema = Joi.object({

    title: Joi.string()
        .min(3)
        .max(60)
        .required()
        .error(new ValidationError("Title must be between 3-60 characters and only contain alphabets")),

    totalMarks: Joi.number()
        .required()
        .error(new ValidationError("Enter totalMarks of the test")),

    timeLimit: Joi.number()
        .required()
        .error(new ValidationError("Enter time limit of the test")),

    teacherId: Joi.number()
        .required()
        .error(new ValidationError("Enter a valid teacherId of the test")),

    questions: Joi.array()
        .items(Joi.object({
            text: Joi
                .string()
                .min(15)
                .max(255)
                .required()
                .error(new ValidationError("question text must be between 15-255 characters")),

            marks: Joi.number()
                .required()
                .error(new ValidationError("Enter marks of the question")),

            type: Joi.number()
                .error(new ValidationError("%s is required")),

            options: Joi.array()
                .when("type", {
                    is: "1",
                    then: Joi.array()
                        .items(Joi.object({
                            optionText: Joi.string()
                                .required()
                                .error(new ValidationError("optionText is required")),

                            isRight: Joi.number()
                                .error(new ValidationError("isRight should be a number")),
                        }))
                        .min(1)
                        .error(new ValidationError("At least one option is required"))

                }),
        }))
        .min(1)
    // .error(new ValidationError("At least one question is required"))


})
