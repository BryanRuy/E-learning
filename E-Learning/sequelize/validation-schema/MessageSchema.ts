import Joi from "joi";
import { ValidationError } from "../utils/errors";
import { JoiType } from "../types/JoiType";
import { Moment } from "moment";

export type NewMessageSchemaType = {
	chatId: number;
	createdBy: number;
	content: string;
	documentId?: number;
};

export type UpdateMessageSchemaType = {
	messageId: number;
	seenAt: Moment;
};

export const NewMessageSchema = JoiType({
	chatId: Joi.number()
		.required()
		.error(new ValidationError("%s is required", "chatId")),

	createdBy: Joi.number()
		.required()
		.error(new ValidationError("%s is required", "userId")),

	documentId: Joi.number().error(
		new ValidationError("%s is required", "documentId")
	),

	content: Joi.string()
		.min(1)
		.max(10000)
		.required()
		.error(new ValidationError("%s is required", "content")),
});

export const UpdateMessageSchema = JoiType({
	messageId: Joi.number()
		.required()
		.error(new ValidationError("%s is required", "messageId")),

	seenAt: Joi.date()
		.required()
		.error(new ValidationError("%s is required", "seenAt")),
});
