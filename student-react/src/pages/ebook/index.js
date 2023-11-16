import React from 'react'
import { Button, Card, CardTitle, CardBody, CardText, CardImg, Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UILoader from '../../@core/components/ui-loader';
import {
    getEbooks,
    getPaymentMethods,
    downloadEbook,
    getStripePublicKey
} from '@store/actions'
import { DOCUMENT_BASE_URL } from '../../helpers/url_helper';
import PreviewBookModal from './preview-book-modal';
import StripeApp from '../stripe'
import SavedCardModal from './saved-cards-modal';
import { useTranslation } from 'react-i18next';

import { notifyError, notifySuccess, } from '../../utility/toast'
import FileSaver from 'file-saver';
import {
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import _ from 'lodash';
import ThreeDSecureAuthenticationComponent from '../stripe/three-d-secure-popup';

const Ebook = (props) => {

    const { t } = useTranslation()
    const { ebooks, ebooksError, ebooksLoading,
        downloadEbookData, downloadEbookSuccess,
        downloadEbookError, downloadEbookLoading } = props

    const { stripePublicKey } = props
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        if (stripePublicKey) {
            let stripePromise = loadStripe(stripePublicKey.publicKey);
            setStripePromise(stripePromise)
        }
    }, [stripePublicKey])

    const [isOpenPreview, setIsOpenPreview] = useState(false)
    const [isOpenCardContainer, setIsOpenCardContainer] = useState(false)
    const [isOpenAddNewCard, setIsOpenAddNewCard] = useState(false)
    const [selectedBook, setSelectedBook] = useState()
    const [randStateChange, setRandStateChange] = useState(Math.random())
    const [previewImage, setPreviewImage] = useState(null)
    const [errorResponse, setErrorResponse] = useState(null)

    const fetchData = () => {
        props.getEbooks()
        props.getPaymentMethods()
    }

    const togglePreviewModal = () => {
        setPreviewImage(null)
        setIsOpenPreview(!isOpenPreview)
    }

    const toggleAddNewCardModal = () => {
        // setSelectedBook(null)
        setIsOpenAddNewCard(!isOpenAddNewCard)
        setIsOpenCardContainer(true)
    }

    const toggleCardContainerModal = () => {
        // setSelectedBook(null)
        setIsOpenCardContainer(!isOpenCardContainer)
    }

    const BuyBook = (ebook) => {
        setRandStateChange(Math.random())
        setSelectedBook(ebook)
    }

    const DownloadBook = (ebook) => {
        props.downloadEbook(ebook.ebookId)
    }

    useEffect(() => {
        if (selectedBook) {
            if (props.paymentMethodsList.length > 0) setIsOpenCardContainer(!!selectedBook)
            else setIsOpenAddNewCard(true)
        }
    }, [selectedBook ,randStateChange])

    useEffect(() => {
        if (previewImage)
            setIsOpenPreview(!!previewImage)
    }, [previewImage])

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (props.paymentMethodSuccess) fetchData()
    }, [props.paymentMethodSuccess])

    
    useEffect(() => {
        if (downloadEbookError) notifyError(t("Ebook"), t(downloadEbookError))
    }, [downloadEbookError])

    const getJSON = async (blob) => {
        try {
            let res = await blob.text()
            let jsonResponse = JSON.parse(res)
            return jsonResponse;
        } catch (error) {
            return null;
        }
    }

    useEffect(async () => {
        if (downloadEbookData) {
            let responseJson = await getJSON(downloadEbookData);
            if (!responseJson) {
                if (downloadEbookSuccess && downloadEbookData)
                    FileSaver.saveAs(downloadEbookData)
            }
            else if (responseJson && responseJson.data) {
                console.log("responseJson", responseJson.data);
                setErrorResponse(responseJson.data.data)
                setIsOpenCardContainer(false)
            } else if (responseJson && responseJson.status == 400){
                notifyError('Ebook', responseJson.message || "Ebook download failed")
            }
        }
    }, [downloadEbookSuccess, downloadEbookData])


    return (
        <>
            <UILoader blocking={ebooksLoading || downloadEbookLoading}>
                {
                    downloadEbookSuccess
                    &&
                    (errorResponse && errorResponse.error == "authentication_required")
                    && <Elements stripe={stripePromise}>
                        <ThreeDSecureAuthenticationComponent postPaymentData={errorResponse} />
                    </Elements>
                }
                <Row className='match-height'>
                    {
                        ebooks &&
                        ebooks.length > 0 &&
                        ebooks.map(
                            (book, index) => (
                                <Col lg='4' md='6' key={`ebooksList-${index}`} >
                                    <Card>
                                        <div className="ebook-card">
                                            <CardImg top src={DOCUMENT_BASE_URL + book.coverImage} alt={book.title} />
                                            <div className="ebook-price"> {book.price} RON</div>
                                        </div>
                                        <CardBody>
                                            <CardTitle tag='h4'>{book.title}</CardTitle>
                                            <CardText>
                                                {book.description}
                                            </CardText>
                                            {
                                                book.isPurchased == false
                                                    ? <Button.Ripple color='primary' onClick={() => BuyBook(book)} outline >
                                                        {t('Buy Now')}
                                                    </Button.Ripple>
                                                    :
                                                    <Button.Ripple color='primary' onClick={() => DownloadBook(book)} outline >
                                                        {t('Download')}
                                                    </Button.Ripple>
                                            }
                                            <Button.Ripple onClick={() => setPreviewImage(book.previewImage)} className="ml-2" color='secondary' outline>
                                                {t('Preview')}
                                            </Button.Ripple>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        )
                    }
                </Row>

                <StripeApp
                    isOpenModal={isOpenAddNewCard}
                    toggleModalState={toggleAddNewCardModal} />

                <PreviewBookModal
                    isOpen={isOpenPreview}
                    Image={previewImage}
                    toggleModal={togglePreviewModal} />

                <SavedCardModal
                    ebook={selectedBook}
                    fetchData={fetchData}
                    isOpen={isOpenCardContainer}
                    toggleAddNewCardModal={toggleAddNewCardModal}
                    toggleModal={toggleCardContainerModal}
                    paymentMethodsList={props.paymentMethodsList}
                />
            </UILoader>
        </>
    )
}



const mapStateToProps = (state) => {
    const {
        ebooks,
        ebooksError,
        ebooksLoading,

        downloadEbookData,
        downloadEbookSuccess,
        downloadEbookError,
        downloadEbookLoading
    } = state.Ebook

    const {
        paymentMethodsList,
        paymentMethodsListError,
        paymentMethodsListLoading,

        paymentMethod,
        paymentMethodSuccess,
        paymentMethodError,
        paymentMethodLoading,

        stripePublicKey
    } = state.Stripe

    return {
        ebooks,
        ebooksError,
        ebooksLoading,

        downloadEbookData,
        downloadEbookSuccess,
        downloadEbookError,
        downloadEbookLoading,

        paymentMethodsList,
        paymentMethodsListError,
        paymentMethodsListLoading,

        paymentMethod,
        paymentMethodSuccess,
        paymentMethodError,
        paymentMethodLoading,

        stripePublicKey
    }

}

const mapDispatchToProps = {
    getEbooks,
    getPaymentMethods,
    downloadEbook,
    getStripePublicKey
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ebook))
