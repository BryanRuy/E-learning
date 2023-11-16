import React from "react"
import { useEffect ,useState } from "react"
import { Row, Col, Button } from 'reactstrap'

import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
    deletePaymentMethod,
    setDefaultPaymentMethod,
} from '@store/actions'
import { useTranslation } from "react-i18next";
import { X } from "react-feather";
import { notifyError, notifySuccess, } from '../../utility/toast'

let AmericanExpress = require("../../assets/images/credit-cards/american_express.png")
let DinersClub = require("../../assets/images/credit-cards/diners_club.png")
let Discover = require("../../assets/images/credit-cards/discover.png")
let Jcb = require("../../assets/images/credit-cards/jcb.png")
let Master = require("../../assets/images/credit-cards/master.png")
let Visa = require("../../assets/images/credit-cards/visa.png")
let UnionPay = require("../../assets/images/credit-cards/union_pay.png")
let UnknownCard = require("../../assets/images/credit-cards/unknown_card.png")

const CardContainer = (props) => {

    const { t } = useTranslation()
    const { paymentMethodsList } = props
    const [selectedCard, setSelectedCard] = useState(paymentMethodsList.map(p => p.default === true))

    const MySwal = withReactContent(Swal)
    const setDefaultCard = (card) => {
        props.setDefaultPaymentMethod({ "fingerprint": card.fingerprint })
    }

    const setDefaultCardPopup = (p) => {
        return MySwal.fire({
            icon: 'question',
            title: t("Confirm"),
            text: t('Are you sure you want to set this card as your default card?'),
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            showCancelButton: true,
            confirmButtonText: 'Yes',
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                setDefaultCard(p)
            }
        })
    }

    const deleteCardPopup = (p) => {
        return MySwal.fire({
            icon: 'question',
            title: t("Confirm"),
            text: t('Are you sure you want to delete this card?'),
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            showCancelButton: true,
            confirmButtonText: 'Yes',
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                props.deletePaymentMethod({ "fingerprint": p.fingerprint })
            }
        })
    }

    useEffect(() => {
        if (props.defaultPaymentMethodSuccess) notifySuccess('Default Card', 'Selected card has been set as your default card successfully')
    }, [props.defaultPaymentMethodSuccess])

    useEffect(() => {
        if (props.deletePaymentMethodSuccess) notifySuccess('Payment Card', 'Selected  card deleted successfully')
    }, [props.deletePaymentMethodSuccess])

    useEffect(() => {
        if (props.defaultPaymentMethodError) notifyError('Default Card', props.defaultPaymentMethodError)
    }, [props.defaultPaymentMethodError])

    useEffect(() => {
        if (props.deletePaymentMethodError) notifyError('Payment Card', props.deletePaymentMethodError)
    }, [props.deletePaymentMethodError])

    const getCardImage = (type) => {
        switch (type) {
            case "visa": return Visa
            case "mastercard": return Master
            case "american express": return AmericanExpress
            case "diners club": return DinersClub
            case "discover": return Discover
            case "jcb": return Jcb
            case "union pay": return UnionPay
            default: return UnknownCard
        }
    }

    return (
        <Row className="card-item-container">
            {
                paymentMethodsList &&
                paymentMethodsList.length > 0 &&
                paymentMethodsList.map((p, index) =>

                    <Col md={6} key={`payment-cards${index}`} >
                        <Row className={`card-item ${p.default ? "active" : ""} `} >
                            <Col md={10}>
                                <div onClick={() => setDefaultCardPopup(p)} >
                                    <Row>
                                        <div>
                                            <img src={getCardImage(p.type)} />
                                        </div>
                                        <div>
                                            <h5> {p.brand}</h5>
                                            <h6>{p.mask}</h6>
                                            <p className="m-0"><small>Expiry {p.exp_month}/{p.exp_year}</small></p>
                                        </div>
                                        <div className="ml-3">
                                            {(props.deletePaymentMethodLoading || props.defaultPaymentMethodLoading) &&
                                                (p.fingerprint == selectedCard.fingerprint) &&
                                                <><i className="las la-spinner la-spin la-2x"></i>&nbsp;&nbsp;</>}
                                        </div>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={2}>
                                <Button color="danger" className="btn-icon btn-delete" size="sm" onClick={() => deleteCardPopup(p)}><X size={16} /></Button>
                            </Col>
                        </Row>
                    </Col>
                )
            }
        </Row>
    )
}

const mapStateToProps = (state) => {

    const {
        defaultPaymentMethod,
        defaultPaymentMethodSuccess,
        defaultPaymentMethodLoading,
        defaultPaymentMethodError,

        deletePaymentMethodSuccess,
        deletePaymentMethodLoading,
        deletePaymentMethodError,


    } = state.Stripe;
    return {

        defaultPaymentMethod,
        defaultPaymentMethodSuccess,
        defaultPaymentMethodLoading,
        defaultPaymentMethodError,

        deletePaymentMethodSuccess,
        deletePaymentMethodLoading,
        deletePaymentMethodError,

    }
}

export default withRouter(
    connect(mapStateToProps, {
        setDefaultPaymentMethod,
        deletePaymentMethod,
    })(CardContainer)
)