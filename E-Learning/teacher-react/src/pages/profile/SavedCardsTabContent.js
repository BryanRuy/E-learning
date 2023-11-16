import React, { useState, useEffect } from 'react'
import { Button, Alert, Label } from 'reactstrap'
import { DateTime } from '../../components/date-time'

// ** Store & Actions
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import {
  getPaymentMethods,
  getPaymentPlan,
  postPayment,
  postPaymentFailure,
  getStripePublicKey,
} from '@store/actions'


import moment from 'moment';
import { notifyError, notifySuccess } from '../../utility/toast'
import StripeApp from '../stripe'
import UILoader from '../../@core/components/ui-loader'
import CardContainer from '../stripe/card-container'
import { useTranslation } from 'react-i18next';
import { infoAlertDialog } from '../../helpers/HelperFunctions';

import {
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ThreeDSecureAuthenticationComponent from '../stripe/three-d-secure-popup';



const SavedCardsTabContent = (props) => {

  const { t } = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { stripePublicKey } = props
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (stripePublicKey) {
      let stripePromise = loadStripe(stripePublicKey.publicKey);
      setStripePromise(stripePromise)
    }
  }, [stripePublicKey])

  const toggleModalState = (toggle) => {
    setIsOpenModal(toggle)
  }

  const getPaymentMethodsAndPlans = () => {
    props.getPaymentMethods()
    props.getPaymentPlan()
  }

  useEffect(() => {
    props.getStripePublicKey()
  }, [])

  useEffect(() => {
    getPaymentMethodsAndPlans()
  }, [])

  // useEffect(() => {
  //   if (props.postPaymentSuccess) {
  //     notifySuccess(t('Payment'), t('Payment was Successfully'))
  //     getPaymentMethodsAndPlans()
  //   }
  //   return () => props.postPaymentFailure(null)
  // }, [props.postPaymentSuccess])

  useEffect(() => {
    if (props.paymentMethodSuccess) {
      getPaymentMethodsAndPlans()
    }
  }, [props.paymentMethodSuccess])


  useEffect(() => {
    if (props.postPaymentError) notifyError('Payment', props.postPaymentError)
  }, [props.postPaymentError])

  useEffect(() => {
    if (props.defaultPaymentMethodSuccess || props.deletePaymentMethodSuccess) {
      getPaymentMethodsAndPlans()
    }
  }, [props.defaultPaymentMethodSuccess, props.deletePaymentMethodSuccess])

  useEffect(() => {
    if (props.defaultPaymentMethodError) notifyError(t('Default Card'), props.defaultPaymentMethodError)
  }, [props.defaultPaymentMethodError])

  useEffect(() => {
    if (props.postPaymentData) {
      if (props.postPaymentSuccess && props.postPaymentData.code == "succeeded") {
        notifySuccess(t('Payment'), t('Payment was Successfully'))
        getPaymentMethodsAndPlans()
      }
      else if (props.postPaymentSuccess && props.postPaymentData.code == "authentication_required") {
        return
      } else {
        return () => props.postPaymentFailure(null)
      }
    }
  }, [props.postPaymentData])

  const activateSubscribtion = () => {
    props.postPayment()
  }

  if (props.postPaymentSuccess && props.postPaymentData.code == "authentication_required") {
    return <Elements stripe={stripePromise}>
      <ThreeDSecureAuthenticationComponent postPaymentData={props.postPaymentData} />
    </Elements>
  }

  return (
    stripePromise
    && <Elements stripe={stripePromise}>
      <UILoader blocking={props.paymentMethodsListLoading || props.defaultPaymentMethodLoading ||
        props.paymentPlanLoading || props.postPaymentLoading || props.deletePaymentMethodLoading}>
        <div className="subscription-page">
          {
            props.paymentMethodsListError && <Alert className="p-1 w-75" color="danger">{props.paymentMethodsListError}</Alert>
          }
          {
            props.paymentPlanError && <Alert className="p-1 w-75" color="danger">{props.paymentPlanError}</Alert>
          }
          {
            props.postPaymentError && <Alert className="p-1 w-75" color="danger">{props.postPaymentError}</Alert>
          }
          {
            props.paymentPlan &&
            Object.keys(props.paymentPlan).length > 0 &&
            <div className="mb-4">
              <h4>{t('Active Plan')}</h4>
              <h5>{props.paymentPlan.price}{props.paymentPlan.currencyCode} <small>/month</small></h5>
              <h6>{props.paymentPlan.endDate && <>Renews on <DateTime type="date" dateTime={props.paymentPlan.endDate} /></>}</h6>
              <div className="pay-subscription-container">
                {
                  ((!props.paymentPlan.startDate && !props.paymentPlan.endDate) || moment(props.paymentPlan.endDate).isBefore(new Date())) &&
                  <Button.Ripple
                    color='success'
                    onClick={() => activateSubscribtion()}>
                    Pay
                  </Button.Ripple>
                }
                <Button.Ripple
                  size="sm"
                  color='flat-primary'
                  onClick={() => toggleModalState(true)}>
                  {t('New Card')}
                </Button.Ripple>
              </div>
            </div>
          }

          <StripeApp
            isOpenModal={isOpenModal}
            toggleModalState={toggleModalState} />

          <CardContainer
            paymentMethodsList={props.paymentMethodsList}
          />
          <p className="mt-1 mb-0">{t('The cards are stored only on the secured payment processor, Stripe.')}</p>
        </div>
      </UILoader>
    </Elements>
  )
}


const mapStateToProps = (state) => {

  const {
    paymentMethodsList,
    paymentMethodsListError,
    paymentMethodsListLoading,

    paymentPlan,
    paymentPlanError,
    paymentPlanLoading,

    postPaymentData,
    postPaymentSuccess,
    postPaymentLoading,
    postPaymentError,

    defaultPaymentMethod,
    defaultPaymentMethodLoading,
    defaultPaymentMethodError,
    defaultPaymentMethodSuccess,

    deletePaymentMethodSuccess,
    deletePaymentMethodLoading,

    paymentMethod,
    paymentMethodSuccess,
    paymentMethodError,
    paymentMethodLoading,

    stripePublicKey

  } = state.Stripe;
  return {
    paymentMethodsList,
    paymentMethodsListError,
    paymentMethodsListLoading,

    paymentPlan,
    paymentPlanError,
    paymentPlanLoading,

    postPaymentData,
    postPaymentSuccess,
    postPaymentLoading,
    postPaymentError,

    defaultPaymentMethod,
    defaultPaymentMethodSuccess,
    defaultPaymentMethodLoading,
    defaultPaymentMethodError,

    deletePaymentMethodSuccess,
    deletePaymentMethodLoading,

    paymentMethod,
    paymentMethodSuccess,
    paymentMethodError,
    paymentMethodLoading,

    stripePublicKey

  }
}

export default withRouter(
  connect(mapStateToProps, {
    getPaymentMethods,
    getPaymentPlan,
    postPayment,
    postPaymentFailure,
    getStripePublicKey,
  })(SavedCardsTabContent)
)
