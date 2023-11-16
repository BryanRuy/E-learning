import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export const SubjectiveAttemptSchema = Joi.object({

    subjectiveAttempt: Joi.array()
        .items(Joi.object({
            attemptId: Joi.number()
                .required()
                .error(new ValidationError("please select a valid attempt")),

            questionId: Joi.number()
                .required()
                .error(new ValidationError("please select a valid question")),

            obtainedMarks: Joi.number()
                .required()
                .error(new ValidationError("please select a enter obtained marks")),
        }))
        .min(1)
        .error(new ValidationError("Enter marks for at least one attempt")),



})

