import JsonWebToken from "jsonwebtoken";
import GlobalConfiguration from "../../configs";
import _ from "lodash";
import * as _vals from "../../utils/validators";
import { UnAuthorizedError } from "../../utils/errors";
import moment from "moment";
import CryptoJS from "crypto-js";

const AuthConfigs = GlobalConfiguration!.AuthorizationConfigurations;

const AUTH_TYPE_JWT = /^JWT\s.*$/;
const AUTH_TYPE_EJWT = /^EJWT\s.*$/;
const AUTH_TYPE_JWT_KEY = "JWT ";
const AUTH_TYPE_EJWT_KEY = "EJWT ";

export class TokenCore {
	static async VerifyJWT(token: string): Promise<any> {
		return new Promise((resolve, reject) => {
			JsonWebToken.verify(
				token,
				AuthConfigs.private_key!,
				(error: any, payload: any) => {
					if (error) {
						return reject(error);
					}
					if (!_.has(payload, "iat") || !_.has(payload, "exp"))
						return reject(
							new UnAuthorizedError("You have been signed out!")
						);

					const tokenExpiry = _vals.isUnixTimestamp(payload.exp);
					if (isNaN(tokenExpiry))
						return reject(
							new UnAuthorizedError("You have been signed out!")
						);

					const currentTime = moment().utc();
					const tokenExpiryMoment = moment.unix(tokenExpiry);
					if (tokenExpiryMoment.isSameOrBefore(currentTime))
						return reject(
							new UnAuthorizedError("You have been signed out!")
						);

					return resolve(payload);
				}
			);
		});
	}

	static async VerifyEJWT(token: string): Promise<any> {
		const decrypted = this.DecryptAES(token);
		return this.VerifyJWT(decrypted);
	}

	/**
	 * @description Verifies the token and makes sure it is still valid
	 * @param {string} token  Authorization Key
	 */
	static async Verify(token: string): Promise<any> {
		//- Verifies the Authorization Header if JWT is used

		if (AUTH_TYPE_JWT.test(token)) {
			return this.VerifyJWT(token.replace(AUTH_TYPE_JWT_KEY, ""));
		}

		//- Verifies the Authorization Header if EJWT is used (EJWT is just a JWT that was Encrypted with AES)
		else if (AUTH_TYPE_EJWT.test(token)) {
			return this.VerifyEJWT(token.replace(AUTH_TYPE_EJWT_KEY, ""));
		}

		//!! Verifies the Authorization Header if JWT is used
		else {
			throw new UnAuthorizedError("Unsupported Authorization method.");
		}
	}

	/**
	 * @description Encrypts the given payload and returns the encrypted string
	 * @param {string} payload
	 */
	static EncryptAES(payload: string): string {
		return CryptoJS.AES.encrypt(payload, AuthConfigs.aes_key).toString();
	}

	/**
	 * @description Decrypts the given payload and returns the decrypted string
	 * @param {string} payload
	 * @throws UnAuthorizedError
	 */
	static DecryptAES(payload: string): string {
		const decrypted = CryptoJS.AES.decrypt(
			payload,
			AuthConfigs.aes_key
		).toString(CryptoJS.enc.Utf8);
		if (decrypted.length > 0) return decrypted;
		throw new UnAuthorizedError("Malformed Authentication Token");
	}

	/**
	 * @description Issues a token with the specified payload
	 * @param payload Token Payload
	 * @param tokenLife Token life in seconds
	 */
	static IssueJWT(payload: any, tokenLife?: number): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const life = tokenLife ?? AuthConfigs.token_life;
				const iat = moment().utc().unix();
				const exp = moment().utc().unix() + life;

				const tokenPayload = {
					...payload,
					iat,
					exp,
				};

				JsonWebToken.sign(
					tokenPayload,
					AuthConfigs.private_key!,
					(err: any, encoded: any) => {
						if (err) return reject(err);
						resolve(encoded);
					}
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * @description Issues a token with the specified payload, encrypts the JWT with AES to make the payload private
	 * @param payload Token Payload
	 * @param tokenLife Token life in seconds
	 * @returns Encrypted JWT
	 */
	static async IssueEJWT(payload: any, tokenLife?: number): Promise<string> {
		const jwtToken = await this.IssueJWT(payload, tokenLife);
		return this.EncryptAES(jwtToken).trim();
	}
}
