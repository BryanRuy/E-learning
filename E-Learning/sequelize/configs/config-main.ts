import { config } from "dotenv";
config();

export namespace Configurations {
	export const DatabaseConfigurations = {
		host: process.env.DATABASE_HOST,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	};

	export const AuthorizationConfigurations = {
		private_key: process.env.AUTHORIZATION_PRIVATE_KEY,
		token_life:
			parseInt(process.env.AUTHORIZATION_TOKEN_LIFE ?? "0") *
			60 *
			60 *
			1000, // Converting Hours to Milliseconds
		aes_key:
			"q8w7h35v9892hv5n8q2po95v939bnq7po79389nP(NV(*&#%nv8W(*#5vNKSJLFHWIYBER(*@#&Fb8yseoiraobw9389b97ra9w37bvrai8w7347gzs",
		salt_rounds: 10,
	};
}
