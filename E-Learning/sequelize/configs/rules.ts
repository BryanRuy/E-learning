import { Configuration, ConfigurationValidator } from "./types";

const NUMBER_REGEX = new RegExp(/^[0-9]+$/);
const BOOL_REGEX = new RegExp(/^false|true$/);
const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const ENCRYPTION_KEY_REGEX = new RegExp(/^.{256}$/);
const STRING_REGEX = new RegExp(/^.*$/);

export const Rules: ConfigurationValidator[] = [
	{ type: 'string', pattern: STRING_REGEX },
	{ type: 'number', pattern: NUMBER_REGEX },
	{ type: 'boolean', pattern: BOOL_REGEX },
	{ type: 'email', pattern: EMAIL_REGEX },
	{ type: 'encryption_key', pattern: ENCRYPTION_KEY_REGEX },
];

export const RequiredConfigurations: Configuration[] = [
	{
		"name": "DATABASE_HOST",
		"type": "string"
	},
	{
		"name": "DATABASE_USER",
		"type": "string"
	},
	{
		"name": "DATABASE_PASSWORD",
		"type": "string"
	},
	{
		"name": "DATABASE_NAME",
		"type": "string"
	},
	{
		"name": "AUTHORIZATION_PRIVATE_KEY",
		"type": "encryption_key"
	},
	{
		"name": "AUTHORIZATION_TOKEN_LIFE",
		"type": "number"
	},
]
