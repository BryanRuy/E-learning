import { User } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			CurrentUser?: User;
			__?: i18nAPI;
		}
	}
}
