"use strict";
const numbers = require("./numbers");
const dates = require("./dates");
const strings = require("./strings");
// const currency = require('./currency')
import * as validators from "./validators";
const sqlTag = require("./sql-tag").sqlTag;

// export const CurrencyConvertor = currency
export const Validators = validators;
export const sql = sqlTag;


export function randomString(len: number, charSet?: string) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}