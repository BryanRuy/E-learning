import Joi from 'joi';
import { max } from 'lodash';
import { ValidationError } from '../utils/errors';

export const UpdateTestSchema = Joi.object({
    testId: Joi.string().uuid()
        .required()
        .error(new ValidationError("testId is required")),

    title: Joi.string()
        .min(10)
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

    createdAt: Joi.any().optional(),
    updatedAt: Joi.any().optional(),

    questions: Joi.array()
        .items(Joi.object({
            questionId: Joi.string().uuid()
                .required()
                .error(new ValidationError("questionId is required")),

            text: Joi
                .string()
                .min(15)
                .max(255)
                .required()
                .error(new ValidationError("question text must be between 15-255 characters")),

            marks: Joi.number()
                .required()
                .error(new ValidationError("Enter marks of the question")),

            createdAt: Joi.any().optional(),
            updatedAt: Joi.any().optional(),
            image: Joi.string().allow(null).optional(),

            type: Joi.number()
                .error(new ValidationError("%s is required")),

            options: Joi.array()
                .when("type", {
                    is: "1",
                    then: Joi.array()
                        .items(Joi.object({
                            optionId: Joi.string().uuid()
                                .required()
                                .error(new ValidationError("optionId is required")),

                            optionText: Joi.string()
                                .required()
                                .error(new ValidationError("optionText is required")),

                            isRight: Joi.number()
                                .error(new ValidationError("isRight should be a number")),

                            createdAt: Joi.any().optional(),
                            updatedAt: Joi.any().optional(),
                        }))
                        .min(1)
                        .error(new ValidationError("At least one option is required"))

                }),
        }))
        .min(1)
    // .error(new ValidationError("At least one question is required"))


})
