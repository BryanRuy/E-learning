import Joi from "joi";
import { ValidationError } from "../utils/errors";
import { JoiType } from "../types/JoiType";

export type NewMeetingSchemaType = {
	guest: string;
	scheduledAt: string;
	createdBy: string;
	message: string;
	agenda: string;
};

export type NewAdminMeetingSchemaType = {
	guest: number;
	scheduledAt: string;
	createdBy: number;
	message: string;
	agenda: string;
};

export type updateMeetingSchemaType = {
	meetingId: string;
	scheduledAt: string;
	status: string;
	message: string;
	userId: string;
};

export const NewMeetingSchema = JoiType({
	guest: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "participant")),

	scheduledAt: Joi.date()
		.required()
		.error(new ValidationError("%s is required", "scheduledAt")),

	createdBy: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "userId")),

	agenda: Joi.string()
		.min(0)
		.max(200)
		.required()
		.error(new ValidationError("%s is required", "agenda")),

	message: Joi.string()
		.max(200)
		.optional()
		.error(new ValidationError("%s is required", "message")),
});

export const NewAdminMeetingSchema = JoiType({
	guest: Joi.number()
		.required()
		.error(new ValidationError("%s is required", "participant")),

	scheduledAt: Joi.date()
		.required()
		.error(new ValidationError("%s is required", "scheduledAt")),

	createdBy: Joi.number()
		.required()
		.error(new ValidationError("%s is required", "userId")),

	agenda: Joi.string()
		.min(0)
		.max(200)
		.required()
		.error(new ValidationError("%s is required", "agenda")),

	message: Joi.string()
		.max(200)
		.optional()
		.error(new ValidationError("%s is required", "message")),
});

export const AcceptOrRejectMeetingSchema = JoiType({
	meetingId: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "meetingId")),

	status: Joi.string()
		.valid(...["accepted", "rejected"])
		.required()
		.error(new ValidationError("%s is required", "status")),

	message: Joi.string().max(200).optional(),
});

export const RescheduleMeetingSchema = JoiType({
	meetingId: Joi.string()
		.uuid()
		.required()
		.error(new ValidationError("%s is required", "meetingId")),

	status: Joi.string()
		.valid(...["rescheduled"])
		.error(new ValidationError("%s is required", "status")),

	scheduledAt: Joi.date()
		.required()
		.error(new ValidationError("%s is required", "scheduledAt")),

	message: Joi.string()
		.max(200)
		.optional()
		.error(new ValidationError("%s is required", "message")),
});
