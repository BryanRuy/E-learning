"use strict";
import { Validators as _vals } from "./../../utils";
import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { BadRequestError, UnAuthorizedError } from "../../utils/errors";
import { TokenCore } from "./token";
import { User } from "../../models/User";
import { CoreHttpErrorHandler } from "../error";
import { tGeneric } from "../../locales";

export class AuthorizeUtil {
	private static ERR_CODES1 = {
		USER_TYPE_NOT_SPECIFIED: "UAR_1",
		USER_TYPE_NOT_ADMIN: "USER_TYPE_NOT_ADMIN",
		USER_TYPE_NOT_SUPER_ADMIN: "USER_TYPE_NOT_SUPER_ADMIN",
		USER_TYPE_NOT_STUDENT: "USER_TYPE_NOT_STUDENT",
		USER_TYPE_NOT_TEACHER: "USER_TYPE_NOT_TEACHER",
	};

	/**
	 * @description Authorizes a user based on JWT or EJWT
	 * @param req Request
	 */
	private static async AuthorizeSocket(
		authorizationHeader: string
	): Promise<User> {
		// Authorization Header
		if (authorizationHeader.length == 0)
			throw new UnAuthorizedError("No Authorization Token provided!");
		// Token Payload if Verified
		return TokenCore.Verify(authorizationHeader);
	}

	/**
	 * @description Authorizes a user based on JWT or EJWT
	 * @param req Request
	 */
	private static async AuthorizeCore(req: Request): Promise<User> {
		// Authhorization Header
		const authHeader = req.headers.authorization ?? "";

		if (authHeader.length == 0)
			throw new UnAuthorizedError("No Authorization Token provided!");

		// Token Payload if Verified
		return TokenCore.Verify(authHeader);
	}

	/**
	 * @description Authorizes a user based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async Authorize(req: Request, res: Response, next: NextFunction) {
		try {
			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	/**
	 * @description Authorizes a Teacher based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async AuthorizeTeacher(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";

			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// If User is not a teacher, not allow
			if (!_.has(req, "CurrentUser.roleId"))
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SPECIFIED}`
				);
			if (req.CurrentUser.roleId != "teacher")
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_TEACHER}`
				);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	/**
	 * @description Authorizes a Student based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async AuthorizeStudent(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";

			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// If User is not a student, not allow
			if (!_.has(req, "CurrentUser.roleId"))
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SPECIFIED}`
				);
			if (req.CurrentUser.roleId != "student")
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_STUDENT}`
				);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	/**
	 * @description Authorizes any user based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async AuthorizeUser(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";

			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// If User is not a admin , super-admin, not allow
			if (!_.has(req, "CurrentUser.roleId"))
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SPECIFIED}`
				);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	/**
	 * @description Authorizes a Admin based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async AuthorizeAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";

			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// If User is not a Admin, not allow
			if (!_.has(req, "CurrentUser.roleId"))
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SPECIFIED}`
				);
			if (
				req.CurrentUser.roleId != "admin" &&
				req.CurrentUser.roleId != "super-admin"
			)
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_ADMIN}`
				);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	/**
	 * @description Authorizes a Super Admin based on JWT or EJWT
	 * @param req Request
	 * @param res Response
	 * @param next NextFunction
	 */
	static async AuthorizeSuperAdmin(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";

			// Authorize user from Token
			req.CurrentUser = await AuthorizeUtil.AuthorizeCore(req);

			// If User is not a super admin, not allow
			if (!_.has(req, "CurrentUser.roleId"))
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SPECIFIED}`
				);
			if (req.CurrentUser.roleId != "super-admin")
				throw new UnAuthorizedError(
					`${ERR_MSG} code:${AuthorizeUtil.ERR_CODES1.USER_TYPE_NOT_SUPER_ADMIN}`
				);

			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}

	static AuthorizeUserSession(
		req: Request,
		userId?: any,
		specificKey?: string
	) {
		const ERR_MSG = "You are not authorized, please login first.";

		// Setting default authorization key
		const sessionKey = specificKey ?? "userId";

		// If UserId is not provided
		if (!userId) throw new BadRequestError(ERR_MSG);

		// If Authorization Key is not found in object
		if (!_.has(req.CurrentUser, sessionKey))
			throw new BadRequestError(ERR_MSG);

		// If Authorization Key is userId, it must be a UUID
		if (
			sessionKey == "userId" &&
			(_vals.isUuid(req.CurrentUser?.userId ?? "") === false ||
				_vals.isUuid(userId ?? "") === false)
		)
			throw new BadRequestError(ERR_MSG);

		// If Authorization key is not matching the Session Key
		if ((req.CurrentUser as any)![sessionKey] !== userId)
			throw new BadRequestError(ERR_MSG);
	}

	static AuthorizeAdminOrSelf(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const ERR_MSG = "Cannot Authorize the user at the moment.";
			if (!req.CurrentUser) {
				throw new UnAuthorizedError(tGeneric.NOT_AUTHORIZED);
			}

			let { userId } = req.params;

			if (userId) {
				if (
					userId != req.CurrentUser.userId &&
					req.CurrentUser.roleId !== "admin" &&
					req.CurrentUser.roleId !== "super-admin"
				) {
					throw new UnAuthorizedError(tGeneric.NOT_AUTHORIZED);
				}
			}
			// - Proceed to the next route only on successful authorization
			if (next) next();
		} catch (err) {
			//! Throw Error to Error Controller
			CoreHttpErrorHandler(err, req, res, next);
		}
	}
}
