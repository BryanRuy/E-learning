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
		"name": "STRIPE_PUBLIC_KEY",
		"type": "string"
	},
	{
		"name": "STRIPE_PRIVATE_KEY",
		"type": "string"
	},
	{
		"name": "STRAPI_USERNAME",
		"type": "string"
	},
	{
		"name": "STRAPI_PASSWORD",
		"type": "string"
	},
	{
		"name": "STRAPI_URL",
		"type": "string"
	},
	{
		"name": "SM_COMPANY_VAT_CODE",
		"type": "number"
	},
	{
		"name": "SM_IS_DRAFT",
		"type": "boolean"
	},
	{
		"name": "SM_SERIES_NAME",
		"type": "string"
	},
	{
		"name": "SM_ISSUER_CNP",
		"type": "number"
	},
	{
		"name": "SM_ISSUER_NAME",
		"type": "string"
	},
	{
		"name": "OS_TICKET_API_KEY",
		"type": "string"
	},
	{
		"name": "OS_TICKET_IP",
		"type": "string"
	},
	{
		"name": "OS_TICKET_NEW_TICKET_URL",
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
	{
		"name": "HTTP_SERVER_ENV",
		"type": "string"
	},
	{
		"name": "HTTP_SERVER_HOST",
		"type": "string"
	},
	{
		"name": "HTTP_SERVER_PORT",
		"type": "number"
	},
	{
		"name": "HTTP_SERVER_SSLENABLED",
		"type": "boolean"
	},
	{
		"name": "SOCKET_SERVER_ENV",
		"type": "string"
	},
	{
		"name": "SOCKET_SERVER_HOST",
		"type": "string"
	},
	{
		"name": "SOCKET_SERVER_PORT",
		"type": "number"
	},
	{
		"name": "SOCKET_SERVER_SSLENABLED",
		"type": "boolean"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_HOST",
		"type": "string"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_PORT",
		"type": "number"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_SECURE",
		"type": "boolean"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_AUTH_USER",
		"type": "string"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_AUTH_PASSWORD",
		"type": "string"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_FROM_NAME",
		"type": "string"
	},
	{
		"name": "EMAIL_SERVER_CONFIG_FROM_EMAIL",
		"type": "email"
	},
	{
		"name": "ERROR_REPORTING_EMAIL",
		"type": "email"
	},
	{
		"name": "DOCUMENTS",
		"type": "string"
	},
	{
		"name": "AUTHORIZATION_AES_KEY",
		"type": "string"
	},
	{
		"name": "SALT_ROUND",
		"type": "number"
	}, 
	{
		"name": "GOOGLE_CLIENT_ID",
		"type": "string"
	}, 
	{
		"name": "GOOGLE_RECAPTCHA_SECRET_KEY",
		"type": "string"
	}, 
	{
		"name":"NO_REPLY_EMAIL_HOST",
		"type":"string"
	},
	{
		"name":"NO_REPLY_EMAIL_AUTH_PASSWORD",
		"type":"string"
	},
	{
		"name":"NO_REPLY_EMAIL_FROM_NAME",
		"type":"string"
	},
	{
		"name":"NO_REPLY_EMAIL_POOL",
		"type":"boolean"
	},
	{
		"name":"NO_REPLY_EMAIL_SECURE",
		"type":"boolean"
	},
	{
		"name":"NO_REPLY_EMAIL_REJECT_UNAUTHORIZED",
		"type":"boolean"
	},
	{
		"name":"NO_REPLY_EMAIL_PORT",
		"type":"number"
	},
	{
		"name": "EBOOKS_IMAGES",
		"type": "string"
	}, 
	{
		"name": "EBOOKS_PDFS",
		"type": "string"
	}, 
	{
		"name": "CONTACT_US",
		"type": "string"
	}, 
	{
		"name": "PRIVACY_POLICY",
		"type": "string"
	}, 
	{
		"name": "TERMS_OF_USE",
		"type": "string"
	}, 
	{
		"name": "STRIPE_WEBHOOK_ENDPOINT_SECRET",
		"type": "string"
	}, 
	{
		"name": "GMAIL_SERVICE",
		"type": "string"
	}, 
	{
		"name": "GMAIL_AUTH",
		"type": "string"
	}, 
	{
		"name": "GMAIL_PASSWORD",
		"type": "string"
	}, 
]
