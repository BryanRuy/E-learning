import {
    GET_STRIPE_PUBLIC_KEY,
    GET_STRIPE_PUBLIC_KEY_SUCCESS,
    GET_STRIPE_PUBLIC_KEY_FAILURE,

    GET_PAYMENT_METHODS,
    GET_PAYMENT_METHODS_SUCCESS,
    GET_PAYMENT_METHODS_FAILURE,

    POST_PAYMENT_METHODS,
    POST_PAYMENT_METHODS_SUCCESS,
    POST_PAYMENT_METHODS_FAILURE,

    GET_PAYMENT_PLAN,
    GET_PAYMENT_PLAN_SUCCESS,
    GET_PAYMENT_PLAN_FAILURE,

    SET_DEFAULT_PAYMENT_METHOD,
    SET_DEFAULT_PAYMENT_METHOD_SUCCESS,
    SET_DEFAULT_PAYMENT_METHOD_FAILURE,

    POST_PAYMENT,
    POST_PAYMENT_SUCCESS,
    POST_PAYMENT_FAILURE,

    DELETE_PAYMENT_METHOD,
DELETE_PAYMENT_METHOD_SUCCESS,
DELETE_PAYMENT_METHOD_FAILURE,
} from './actionTypes'



export const getStripePublicKey = () => {
    return {
        type: GET_STRIPE_PUBLIC_KEY
    }
}

export const getStripePublicKeySuccess = (data) => {
    return {
        type: GET_STRIPE_PUBLIC_KEY_SUCCESS,
        payload: data
    }
}

export const getStripePublicKeyFailure = (error) => {
    return {
        type: GET_STRIPE_PUBLIC_KEY_FAILURE,
        payload: error
    }
}

export const getPaymentMethods = () => {
    return {
        type: GET_PAYMENT_METHODS
    }
}

export const getPaymentMethodsSuccess = (data) => {
    return {
        type: GET_PAYMENT_METHODS_SUCCESS,
        payload: data
    }
}

export const getPaymentMethodsFailure = (error) => {
    return {
        type: GET_PAYMENT_METHODS_FAILURE,
        payload: error
    }
}

export const postPaymentMethods = (data) => {
    return {
        type: POST_PAYMENT_METHODS,
        payload: data
    }
}

export const postPaymentMethodsSuccess = (data) => {
    return {
        type: POST_PAYMENT_METHODS_SUCCESS,
        payload: data
    }
}

export const postPaymentMethodsFailure = (error) => {
    return {
        type: POST_PAYMENT_METHODS_FAILURE,
        payload: error
    }
}

export const getPaymentPlan = () => {
    return {
        type: GET_PAYMENT_PLAN
    }
}

export const getPaymentPlanSuccess = (data) => {
    return {
        type: GET_PAYMENT_PLAN_SUCCESS,
        payload: data
    }
}

export const getPaymentPlanFailure = (error) => {
    return {
        type: GET_PAYMENT_PLAN_FAILURE,
        payload: error
    }
}

export const setDefaultPaymentMethod = (data) => {
    return {
        type: SET_DEFAULT_PAYMENT_METHOD,
        payload: data
    }
}

export const setDefaultPaymentMethodSuccess = (data) => {
    return {
        type: SET_DEFAULT_PAYMENT_METHOD_SUCCESS,
        payload: data
    }
}

export const setDefaultPaymentMethodFailure = (error) => {
    return {
        type: SET_DEFAULT_PAYMENT_METHOD_FAILURE,
        payload: error
    }
}

export const postPayment = (data) => {
    return {
        type: POST_PAYMENT,
        payload:data
    }
}

export const postPaymentSuccess = (data) => {
    return {
        type: POST_PAYMENT_SUCCESS,
        payload: data
    }
}

export const postPaymentFailure = (error) => {
    return {
        type: POST_PAYMENT_FAILURE,
        payload: error
    }
}

export const deletePaymentMethod =(data) =>{
 return {
     type:DELETE_PAYMENT_METHOD,
     payload:data
 }
}

export const deletePaymentMethodSuccess =(data) =>{
 return {
     type:DELETE_PAYMENT_METHOD_SUCCESS,
     payload:data
 }
}

export const deletePaymentMethodFailure =(error) =>{
 return {
     type:DELETE_PAYMENT_METHOD_FAILURE,
     payload:error
 }
}