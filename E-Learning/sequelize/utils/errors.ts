import { t } from "../locales";

export class ApplicationError extends Error {
	constructor(message: string, data: any = undefined) {
		super(message);
		this.additionalData = data;
	}
	additionalData: any = undefined;
	get statusCode() {
		return 500;
	}
}

export class DatabaseError extends ApplicationError {
	get statusCode() {
		return 500;
	}
}

export class UnknownError extends ApplicationError {
	get statusCode() {
		return 500;
	}
}

export class UserFacingError extends ApplicationError {
	localeMessage: [string, ...any];

	constructor(message: string, ...args: any) {
		super(message);
		this.localeMessage = [message, ...args];
	}

	get statusCode() {
		return 400;
	}
}

// UserFacing Errors

export class UnAuthorizedError extends UserFacingError {
	get statusCode() {
		return 401;
	}
}

export class ValidationError extends UserFacingError {
	isJoi = true;
	localeMessage: [string, ...any];
	constructor(message: string, ...args: any) {
		super(message);
		this.localeMessage = [message, ...args];
	}
}

export class NotFoundError extends UserFacingError {
	get statusCode() {
		return 404;
	}
}

export class BadRequestError extends UserFacingError {
	get statusCode() {
		return 400;
	}
}

export class MissingParamError extends BadRequestError {}
