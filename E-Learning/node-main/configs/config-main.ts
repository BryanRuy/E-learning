import { config } from 'dotenv';
config();

export namespace Configurations {
    export const DatabaseConfigurations = {
        "host": process.env.DATABASE_HOST,
        "user": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_NAME,
    }

    export const StrapiConfigurations = {
        "strapiUsername": process.env.STRAPI_USERNAME,
        "strapiPassword": process.env.STRAPI_PASSWORD,
        "strapiUrl": process.env.STRAPI_URL
    }

    export const OSTicketConfigurations = {
        "apiKey": process.env.OS_TICKET_API_KEY,
        "newTicketUrl": process.env.OS_TICKET_NEW_TICKET_URL,
        "ip": process.env.OS_TICKET_IP,
    }

    export const SmartBillingConfigurations = {
        "companyVatCode": process.env.SM_COMPANY_VAT_CODE,
        "isDraft": process.env.SM_IS_DRAFT,
        "seriesName": process.env.SM_SERIES_NAME,
        "issuerCnp": process.env.SM_ISSUER_CNP,
        "issuerName": process.env.SM_ISSUER_NAME,
        "username": process.env.SM_USERNAME,
        "token": process.env.SM_TOKEN
    }

    export const AuthorizationConfigurations = {
        "private_key": process.env.AUTHORIZATION_PRIVATE_KEY,
        "token_life": parseInt(process.env.AUTHORIZATION_TOKEN_LIFE ?? '0') * 60 * 60 * 1000,   // Converting Hours to Milliseconds
        "aes_key": process.env.AUTHORIZATION_AES_KEY,
        "salt_round": parseInt(process.env.SALT_ROUND ?? '10')
    }

    export const StripeAccounts = {
        RO: {
            publicKey: process.env.STRIPE_PUBLIC_KEY!,
            secretKey: process.env.STRIPE_PRIVATE_KEY!,
            apiVersion: process.env.STRIPE_API_VERSION ?? '2020-08-27'
        },
        webhook_endpoint_secret: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET

    }

    export const HTTPServerConfigurations = {
        "env": process.env.HTTP_SERVER_ENV,
        "host": process.env.HTTP_SERVER_HOST,
        "port": process.env.HTTP_SERVER_PORT,
        "sslEnabled": process.env.HTTP_SERVER_SSLENABLED == 'true',
    }

    export const WSServerConfigurations = {
        "env": process.env.SOCKET_SERVER_ENV,
        "host": process.env.SOCKET_SERVER_HOST,
        "port": process.env.SOCKET_SERVER_PORT,
        "sslEnabled": process.env.SOCKET_SERVER_SSLENABLED == 'true',
    }
    export const GmailServiceConfiguration = {
        "service": process.env.GMAIL_SERVICE,
        "port":465,
        "secure":true,
        "secureConnection":false,
        auth: {
          "user":  process.env.GMAIL_AUTH,
          "pass":  process.env.GMAIL_PASSWORD,
        },
        tls:{
            rejectUnAuthorized:true
        }
    }

    export const EmailServerConfigurations = {
        "config": {
            "host": process.env.EMAIL_SERVER_CONFIG_HOST,
            "port": process.env.EMAIL_SERVER_CONFIG_PORT,
            "secure": process.env.EMAIL_SERVER_CONFIG_SECURE, // true for 465, false for other ports
            "auth": {
                "user": process.env.EMAIL_SERVER_CONFIG_AUTH_USER,
                "pass": process.env.EMAIL_SERVER_CONFIG_AUTH_PASSWORD,
            }
        },
        "from": {
            "name": process.env.EMAIL_SERVER_CONFIG_FROM_NAME,
            "email": process.env.EMAIL_SERVER_CONFIG_FROM_EMAIL
        }
    }

    export const NoReplyEmailServerConfigurations = {
        "config": {
            "host": process.env.NO_REPLY_EMAIL_HOST,
            "port": process.env.NO_REPLY_EMAIL_PORT,
            "secure": process.env.NO_REPLY_EMAIL_SECURE, // true for 465, false for other ports
            "auth": {
                "user": process.env.NO_REPLY_EMAIL_AUTH_USER,
                "pass": process.env.NO_REPLY_EMAIL_AUTH_PASSWORD,
            }
        },
        "from": {
            "name": process.env.NO_REPLY_EMAIL_FROM_NAME,
            "email": process.env.NO_REPLY_EMAIL_FROM_EMAIL
        }
    }

    export const ErrorReportingConfigurations = {
        "email": process.env.ERROR_REPORTING_EMAIL
    }

    export const constants = {
        "base_url": process.env.BASE_URL,
        "public_url": process.env.PUBLIC_URL,
        "documents": `${__dirname}/../${process.env.DOCUMENTS}`,
        "public_directory": `${__dirname}/../${process.env.PUBLIC_DIRECTORY}`,
        "blogs": `${__dirname}/../${process.env.BLOGS}`,
        "profile_picture": `${__dirname}/../${process.env.PROFILE_PICTURE}`,
        "questions": `${__dirname}/../${process.env.QUESTIONS}`,
        "ebooks_images": `${__dirname}/../${process.env.EBOOKS_IMAGES}`,
        "ebooks_pdfs": `${__dirname}/../${process.env.EBOOKS_PDFS}`,
        "google_client_id": process.env.GOOGLE_CLIENT_ID,
        "google_recaptcha_secret_key": process.env.GOOGLE_RECAPTCHA_SECRET_KEY,        
    }

    export const WebsiteUrls = {
        "contact_us": process.env.CONTACT_US,
        "terms_of_use": process.env.TERMS_OF_USE,
        "privacy_policy": process.env.PRIVACY_POLICY,
    }
}
