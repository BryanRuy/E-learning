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


const initialState = {
    stripePublicKey: null,
    stripePublickeyLoading: false,
    stripePublickeyError: null,

    paymentMethodsList: [],
    paymentMethodsListError: null,
    paymentMethodsListLoading: false,

    paymentMethod: [],
    paymentMethodSuccess: false,
    paymentMethodError: null,
    paymentMethodLoading: false,

    paymentPlan: {},
    paymentPlanLoading: false,
    paymentPlanError: null,

    defaultPaymentMethod: {},
    defaultPaymentMethodSuccess: false,
    defaultPaymentMethodLoading: false,
    defaultPaymentMethodError: null,

    postPaymentSuccess: false,
    postPaymentLoading: false,
    postPaymentError: null,

    deletePaymentMethodSuccess: false,
    deletePaymentMethodLoading: false,
    deletePaymentMethodError: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_STRIPE_PUBLIC_KEY:
            state = {
                ...state,
                stripePublickeyLoading: true,
            }
            break;
        case GET_STRIPE_PUBLIC_KEY_SUCCESS:
            state = {
                ...state,
                stripePublickeyLoading: false,
                stripePublicKey: action.payload
            }
            break;
        case GET_STRIPE_PUBLIC_KEY_FAILURE:
            state = {
                ...state,
                stripePublickeyLoading: false,
                stripePublickeyError: action.payload
            }
            break;

        case GET_PAYMENT_METHODS:
            state = {
                ...state,
                paymentMethodsListLoading: true,
                paymentMethodSuccess:false,
                defaultPaymentMethodSuccess: false,
                deletePaymentMethodSuccess: false
            }
            break;
        case GET_PAYMENT_METHODS_SUCCESS:
            state = {
                ...state,
                paymentMethodsListLoading: false,
                paymentMethodsList: action.payload
            }
            break;
        case GET_PAYMENT_METHODS_FAILURE:
            state = {
                ...state,
                paymentMethodsListLoading: false,
                paymentMethodsListError: action.payload
            }
            break;

        case POST_PAYMENT_METHODS:
            state = {
                ...state,
                paymentMethodLoading: true,
                paymentMethodSuccess: false,
                paymentMethodError: null
            }
            break;
        case POST_PAYMENT_METHODS_SUCCESS:
            state = {
                ...state,
                paymentMethodLoading: false,
                paymentMethodSuccess: true,
                paymentMethod: action.payload
            }
            break;
        case POST_PAYMENT_METHODS_FAILURE:
            state = {
                ...state,
                paymentMethodLoading: false,
                paymentMethodError: action.payload
            }
            break;

        case GET_PAYMENT_PLAN:
            state = {
                ...state,
                paymentPlanLoading: true,
            }
            break;
        case GET_PAYMENT_PLAN_SUCCESS:
            state = {
                ...state,
                paymentPlanLoading: false,
                paymentPlan: action.payload
            }
            break;
        case GET_PAYMENT_PLAN_FAILURE:
            state = {
                ...state,
                paymentPlanLoading: false,
                paymentPlanError: action.payload
            }
            break;

        case SET_DEFAULT_PAYMENT_METHOD:
            state = {
                ...state,
                defaultPaymentMethodLoading: true,
                defaultPaymentMethodSuccess: false,
                defaultPaymentMethodError: null,
            }
            break;
        case SET_DEFAULT_PAYMENT_METHOD_SUCCESS:
            state = {
                ...state,
                defaultPaymentMethod: action.payload,
                defaultPaymentMethodLoading: false,
                defaultPaymentMethodSuccess: true
            }
            break;
        case SET_DEFAULT_PAYMENT_METHOD_FAILURE:
            state = {
                ...state,
                defaultPaymentMethodLoading: false,
                defaultPaymentMethodError: action.payload
            }
            break;


        case POST_PAYMENT:
            state = {
                ...state,
                postPaymentLoading: true,
                postPaymentSuccess: false,
                postPaymentError: null,
            }
            break;

        case POST_PAYMENT_SUCCESS:
            state = {
                ...state,
                postPaymentLoading: false,
                postPaymentSuccess: true
            }
            break;

        case POST_PAYMENT_FAILURE:
            state = {
                ...state,
                postPaymentLoading: false,
                postPaymentError: action.payload
            }
            break;

        case DELETE_PAYMENT_METHOD:
            state = {
                ...state,
                deletePaymentMethodLoading: true
            }
            break;
        case DELETE_PAYMENT_METHOD_SUCCESS:
            state = {
                ...state,
                deletePaymentMethodLoading: false,
                deletePaymentMethodSuccess: true
            }
            break;
        case DELETE_PAYMENT_METHOD_FAILURE:
            state = {
                ...state,
                deletePaymentMethodLoading: false,
                deletePaymentMethodError: action.payload
            }
            break;

        default:
            state = { ...state }
    }
    return state;
}