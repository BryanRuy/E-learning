import Joi from "joi";
import { ValidationError } from "../utils/errors";
import { JoiType } from "../types/JoiType";
import { Moment } from "moment";

export type NewChatParticipantSchemaType = {
	chatId: string;
	participants: string[];
	userId: string;
};

export type ChatParticipantMessagesDeliveredSchemaType = {
	chatId: number;
	chatParticipantId: number;
	deliveredAt: Moment;
};

export type ChatParticipantMessagesSeenSchemaType = {
	chatId: number;
	chatParticipantId: number;
	deliveredAt?: Moment | null;
	seenAt: Moment;
};

export const NewChatParticipantSchema = JoiType({
	chatId: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "chatId")),

	participants: Joi.array()
		.items(Joi.string().uuid().required())
		.min(1)
		.error(new ValidationError("At least one participant is required")),

	userId: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "userId")),
});
