
import { connect } from "react-redux";
import { withRouter } from "react-router";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Card, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { getStripePublicKey, postPaymentMethods } from '@store/actions'
import UILoader from '../../@core/components/ui-loader';

import {
    CardElement,
    Elements,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import "./style.scss";
import { useTranslation } from "react-i18next";
import { notifySuccess } from "../../utility/toast";
let cardIllustration = require('../../assets/images/credit-cards/card_illustration.png')
let securedByStripe = require('../../assets/images/credit-cards/powered-by-stripe.svg')

const CARD_OPTIONS = {
    iconStyle: "solid",
    hidePostalCode: true,
    style: {
        base: {
            iconColor: "#9d0bba",
            color: "#000000",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": {
                color: "#fce883"
            },
            "::placeholder": {
                color: "#000000"
            }
        },
        invalid: {
            iconColor: "#000000",
            color: "#000000"
        }
    }
};

const CardField = ({ onChange }) => (
    <div className="FormRow">
        <CardElement options={CARD_OPTIONS} onChange={onChange} />
    </div>
);


const SubmitButton = ({ processing, error, children, disabled }) => (
    <button
        className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
        type="submit"
        disabled={processing || disabled}
    >
        {processing ? "Processing..." : children}
    </button>
);

const CheckoutForm = (props) => {
    const { t } = useTranslation()
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [stripeToken, setStripeToken] = useState(null);
    const [stripePaymentMethod, setStripePaymentMethod] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (error) {
            elements.getElement("card").focus();
            return;
        }

        if (cardComplete) {
            setProcessing(true);
        }

        const paymentMethodRes = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        setProcessing(false);

        if (paymentMethodRes.error) {
            setError(paymentMethodRes.error);
        } else {
            setStripePaymentMethod(paymentMethodRes.paymentMethod.id)
            props.postPayments(paymentMethodRes.paymentMethod.id)
        }

    };

    const reset = () => {
        setError(null);
        setProcessing(false);
        setStripeToken(null);
        setStripePaymentMethod(null)
    };

    return (
        <>
            <img src={cardIllustration} className="illustration-card " />
            {
                stripePaymentMethod && props.paymentMethodSuccess  ?
                    <div className="Result">
                        <div className="ResultTitle" role="alert">
                            {t('Card added successfully')}
                        </div>
                    </div>
                    :
                    <form className="Form" onSubmit={handleSubmit}>

                        <fieldset className="FormGroup">
                            <CardField
                                onChange={(e) => {
                                    setError(e.error);
                                    setCardComplete(e.complete);
                                }}
                            />
                        </fieldset>
                        <SubmitButton processing={processing || props.paymentMethodLoading} error={error} disabled={!stripe}>
                        {t('Add Card')}  
                        </SubmitButton>
                    </form>

            }
        </>
    );

};

const ELEMENTS_OPTIONS = {
    fonts: [
        {
            cssSrc: "https://fonts.googleapis.com/css?family=Roboto"
        }
    ]
};


const StripeApp = (props) => {

    const { t } = useTranslation()
    const { isOpenModal, toggleModalState } = props
    const { stripePublicKey } = props
    const [stripe, setStripe] = useState(null);

    console.log();
    useEffect(() => {
        if (stripePublicKey) {
            let stripePromise = loadStripe(stripePublicKey.publicKey);
            setStripe(stripePromise)
        }
    }, [stripePublicKey])

    useEffect(() => {
        props.getStripePublicKey()
    }, [])

    const postPayments = (data) => {
        props.postPaymentMethods(data)
    }

    useEffect(() => {
        if(props.paymentMethodSuccess){
            notifySuccess(t("Card"),t("Card added successfully"))
            toggleModalState()
        }
    },[props.paymentMethodSuccess])

    
    


    return (
        <>
            <UILoader blocking={(props.stripePublickeyLoading || props.paymentMethodLoading) && isOpenModal}>
                {
                    props.stripePublicKey &&
                    stripe &&
                    <Modal className="modal-lg" scrollable isOpen={isOpenModal} toggle={toggleModalState}>
                        <ModalHeader toggle={toggleModalState}>{t('Add Card')} </ModalHeader>
                        <ModalBody>
                            {
                                props.stripePublicKey &&
                                stripe &&
                                <div className="AppWrapper">
                                    <Elements stripe={stripe} options={ELEMENTS_OPTIONS}>
                                        <CheckoutForm postPayments={postPayments} paymentMethodLoading={props.paymentMethodLoading}/>
                                    </Elements>
                                    <div className='secured-by-stripe'>
                                        <img src={securedByStripe} />
                                    </div>
                                </div>
                            }
                        </ModalBody>
                    </Modal>

                }
            </UILoader>
        </>
    );
};

const mapStateToProps = (state) => {
    const { stripePublicKey,
        stripePublickeyLoading,
        stripePublickeyError,

        paymentMethod,
        paymentMethodSuccess,
        paymentMethodError,
        paymentMethodLoading
    } = state.Stripe;
    return {
        stripePublicKey,
        stripePublickeyLoading,
        stripePublickeyError,

        paymentMethod,
        paymentMethodSuccess,
        paymentMethodError,
        paymentMethodLoading
    };
};

const mapDispatchToProps = {
    getStripePublicKey,
    postPaymentMethods
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StripeApp)
)
