import Stripe from 'stripe';
import { Ebook, PaymentPlan, User } from '../../../sequelize';
import GlobalConfigurations from '../../../configs';
const SmartBillingConfigurations = GlobalConfigurations!.SmartBillingConfigurations


import base64 from 'base-64';
import axios from 'axios';
import moment from 'moment';
import { Logger } from '../../../sequelize/utils/logger';

const POST_INVOICE = 'https://ws.smartbill.ro/SBORO/api/invoice';

type NewInvoice = {
    user: User
    plan?: PaymentPlan
    ebook?: Ebook
    issueDate: Date
}

function getAuthToken() {
    let { username, token } = SmartBillingConfigurations
    let authToken = base64.encode(`${username}:${token}`);
    return `Basic ${authToken}`
}

function createInvoice(payload: NewInvoice) {
    let user = payload.user;
    const {
        companyVatCode,
        isDraft,
        issuerCnp,
        seriesName,
        issuerName
    } = SmartBillingConfigurations;

    let product = {};
    if (payload.plan) {
        product = {
            "name": `Abonament ${payload.plan.planDuration}`,
            "code": `Abonament ${payload.plan.planDuration}`,
            "translatedName": `Abonament ${payload.plan.planDuration}`,
            "translatedMeasuringUnit": "",
            "isDiscount": false,
            "measuringUnitName": "buc",
            "currency": "RON",
            "quantity": 1,
            "price": payload.plan.price,
            "isTaxIncluded": false,
            "taxName": "Normala",
            "taxPercentage": 0,
            "saveToDb": true,
            "warehouseName": "",
            "isService": false
        }
    }
    else if (payload.ebook) {
        product = {
            "name": `Ebook`,
            "code": `Ebook`,
            "translatedName": `Ebook`,
            "translatedMeasuringUnit": "",
            "isDiscount": false,
            "measuringUnitName": "buc",
            "currency": "RON",
            "quantity": 1,
            "price": payload.ebook.price,
            "isTaxIncluded": false,
            "taxName": "Normala",
            "taxPercentage": 0,
            "saveToDb": true,
            "warehouseName": "",
            "isService": false
        }
    }

    return {
        "companyVatCode": companyVatCode,
        "client": {
            "name": user.name,
            "vatCode": "",
            "regCom": "",
            "address": user.address,
            "isTaxPayer": false,
            "city": user.city,
            "country": user.country,
            "county": user.county,
            "email": user.email,
            "saveToDb": true
        },
        "isDraft": isDraft,
        "sendEmail": true,
        "email": {
            "cc": user.email
        },
        "issueDate": moment(payload.issueDate).format("YYYY-MM-DD"),
        "seriesName": seriesName,
        "currency": "RON",
        "exchangeRate": 1,
        "language": "RO",
        "precision": 2,
        "issuerCnp": "",
        "issuerName": issuerName,
        "aviz": "",
        "dueDate": moment(payload.issueDate).format("YYYY-MM-DD"),
        "mentions": "",
        "observations": "",
        "delegateAuto": "",
        "delegateIdentityCard": "",
        "delegateName": "",
        "deliveryDate": "",
        "paymentDate": "",
        "useStock": false,
        "useEstimateDetails": false,
        "usePaymentTax": false,
        "paymentBase": 0,
        "colectedTax": 0,
        "paymentTotal": 0,
        "products": [{ ...product }]
    }
}

export class SmartBilling {


    static async sendInvoice(params: NewInvoice) {
        try{
            let invoice = createInvoice(params)
            let response = await axios({
                method: 'post',
                url: POST_INVOICE,
                data: invoice,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                }
            });
            Logger.success(`USER: ${params.user.userId}-${params.user.name} -- Invoice has been issued successfully! `)
            return response.data;
        }
        catch(err: any){
            
            let errMessage = err?.response?.data?.errorText ?? 'Invoice cannot be sent due to unknown reason';
            if(errMessage) Logger.error(`USER: ${params.user.userId}-${params.user.name} -- ${errMessage}`);
            if(!errMessage) Logger.info(err);
        }
        
    }

}
