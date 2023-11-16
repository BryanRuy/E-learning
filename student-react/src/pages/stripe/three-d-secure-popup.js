import React, { useState, useEffect } from 'react'
import {
    useStripe
  } from "@stripe/react-stripe-js";
import { notifyError, notifySuccess } from '../../utility/toast';

const ThreeDSecureAuthenticationComponent = (props) => {
    const stripe = useStripe();
    const [paymentIntent, setPaymentIntent] = useState(null);

    console.log("ThreeDSecureAuthenticationComponent" , props);

    useEffect(() => {
        console.log("CHECK THREE =>", props.postPaymentData , stripe);
      (async () => {
        if (props.postPaymentData.error == "authentication_required") {
          if (stripe) {
            let client_secret =props.postPaymentData.client_secret
            let pmIntent = await stripe.confirmCardPayment(client_secret, {
              payment_method: props.postPaymentData.paymentMethod
            })
            setPaymentIntent(pmIntent);
          }
        }
      })();
    }, [props.postPaymentData.error, stripe])

    useEffect(() => {
      if(paymentIntent && paymentIntent.error && paymentIntent.error.code == "payment_intent_authentication_failure") {
        notifyError('Payment',paymentIntent.error.message)
      }
    },[paymentIntent])
  
    return (
      <>
        {
            paymentIntent ? '' : <p>Waiting for Payment</p>
        }
      </>
    )
  }

  export default ThreeDSecureAuthenticationComponent