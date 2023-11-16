import Joi from "joi";
import { ValidationError } from "../utils/errors";
import { JoiType } from "../types/JoiType";

export type NewMeetingFeedbackSchemaType = {
	meetingId: string;
	userId: number;
	rating: number;
	message: string;
};

export const NewMeetingFeedbackSchema = JoiType({
	meetingId: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s meetingId is required", "meetingId")),

	userId: Joi.number()
		.required()
		.error(new ValidationError("%s userId is required", "userId")),

	rating: Joi.number()
		.min(1)
		.max(5)
		.required()
		.error(new ValidationError("%s rating is required", "rating")),

	message: Joi.string()
		.max(200)
		.optional()
		.error(new ValidationError("%s message is required", "message")),
});
