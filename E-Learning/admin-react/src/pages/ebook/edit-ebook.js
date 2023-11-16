
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Row, Col, Card, CardBody, Input, Form, FormGroup, Button, Label } from "reactstrap"
import ImagePickerWithPreview from "./image-picker-with-preview"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import {
    putEbook,
} from '@store/actions'
import TestCropper from "./cropper"
import UILoader from '../../@core/components/ui-loader';
import { errorAlertDialog, successAlertDialog } from "../../helpers/HelperFunctions"
import { DOCUMENT_BASE_URL } from "../../helpers/url_helper"
import { useTranslation } from 'react-i18next'
const filePlaceholder = require(`@src/assets/images/custom-placeholder/file_preview_placeholder.jpg`);
const imgPlaceholder = require(`@src/assets/images/custom-placeholder/img_preview_placeholder.jpeg`);


const EditEbook = (props) => {

    const {t} = useTranslation()
    const { putEbookSuccess,
        putEbookError,
        putEbookLoading } = props

    const { ebook } = props.history.location.state
    const [title, setTitle] = useState(ebook.title)
    const [description, setDescription] = useState(ebook.description)
    const [price, setPrice] = useState(ebook.price)
    const [currentType, setCurrentType] = useState()

    const [selectedImage, setSelectedImage] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [coverImage, setCoverImage] = useState(DOCUMENT_BASE_URL+ebook.coverImage)
    const [coverFile, setCoverFile] = useState(ebook.coverImage.replace("/ebooks/", ""))

    const [previewImage, setPreviewImage] = useState(DOCUMENT_BASE_URL+ebook.previewImage)
    const [previewFile, setPreviewFile] = useState(ebook.previewImage.replace("/ebooks/", ""))

    const [bookUrl, setBookUrl] = useState(filePlaceholder)
    const [bookFile, setBookFile] = useState()


    useEffect(() => {
        if (selectedImage) {
            setIsModalOpen(!!selectedImage);
        }
    }, [selectedImage])

    const onChange = (e, selectedFile) => {
        const reader = new FileReader(),
            files = e.target.files

        setCurrentType(selectedFile)

        reader.onload = () => {

            if (selectedFile == 'cover') {
                setSelectedImage(reader.result)
                setCoverFile(files[0])
            }
            else if (selectedFile == 'preview') {
                setSelectedImage(reader.result)
                setPreviewFile(files[0])
            }

            else if (selectedFile == 'bookUrl') {
                setBookUrl(reader.result)
                setBookFile(files[0])
            }
        }
        reader.readAsDataURL(files[0])
    }

    const onCrop = (type, cropImage) => {
        if (type == 'cover') {
            setCoverImage(cropImage)
        }
        if (type == 'preview') {
            setPreviewImage(cropImage)
        }
        setSelectedImage(null)
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }


    const EditEbook = async () => {
        if(!coverImage){errorAlertDialog('Please select a cover Image'); return}
        if(!previewImage){errorAlertDialog('Please select a preview Image'); return}
        if(!bookFile){errorAlertDialog('Please select a book file'); return}
        if(!title){errorAlertDialog('Please enter book title'); return}
        if(!description){errorAlertDialog('Please enter book description'); return}
        if(!price){errorAlertDialog('Please enter book price'); return}
        
        var coverBlobData = await fetch(coverImage)
        var coverBlob = await coverBlobData.blob()
        var fileOfCoverBlob = new File([coverBlob], coverFile.name);
        
        var previewBlobData = await fetch(previewImage)
        var previewBlob = await previewBlobData.blob()
        var fileOfPreviewBlob = new File([previewBlob], previewFile.name);
        
        if (fileOfCoverBlob) fd.append(`coverImage`, fileOfCoverBlob, fileOfCoverBlob.name);
        if (fileOfPreviewBlob) fd.append(`previewImage`,fileOfPreviewBlob, fileOfPreviewBlob.name);
        if (bookFile) fd.append(`bookUrl`, bookFile, bookFile.name);
        
        const fd = new FormData();
        fd.append(`title`, title);
        fd.append(`description`, description);
        fd.append(`ebookId`, ebook.ebookId);
        fd.append(`price`, price);
        fd.append(`priceInCents`, price*100);

        props.putEbook(fd)
    }

    useEffect(() => {
        if (putEbookError) errorAlertDialog(putEbookError)
        if (putEbookSuccess) successAlertDialog(t("Ebook updated successfully"))
    }, [putEbookError, putEbookSuccess])


    return (
        <UILoader blocking={putEbookLoading}>
            <Row>
                <Col sm='12'>
                    <Card>
                        <CardBody>

                            <Form className='mt-2' onSubmit={e => e.preventDefault()}>
                                <Row>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Title')}</Label>
                                            <Input id='blog-edit-title' value={title} onChange={e => setTitle(e.target.value)} required/>
                                        </FormGroup>
                                    </Col>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Description')}</Label>
                                            <Input id='blog-edit-title' value={description} onChange={e => setDescription(e.target.value)} required />
                                        </FormGroup>
                                    </Col>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Price')}</Label>
                                            <Input type="number" id='blog-edit-title' value={price} onChange={e => setPrice(e.target.value)} required />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className='mb-2' sm='12' md='6'>
                                        <ImagePickerWithPreview
                                            Image={coverImage}
                                            type={"cover"}
                                            lblTitle={t("Cover Image")}
                                            acceptType={'.jpg, .png, .jpeg'}
                                            onChange={onChange}
                                        />
                                    </Col>

                                    <Col className='mb-2' sm='12' md='6'>
                                        <ImagePickerWithPreview
                                            Image={previewImage}
                                            type={"preview"}
                                            lblTitle={t("Preview Image")}
                                            acceptType={'.jpg, .png,  .jpeg'}
                                            onChange={onChange}
                                        />
                                    </Col>

                                    <Col className='mb-2' sm='12' md='12'>
                                        <ImagePickerWithPreview
                                            Image={bookUrl}
                                            type={"bookUrl"}
                                            lblTitle={t("Pdf book file")}
                                            acceptType={'.pdf'}
                                            onChange={onChange}
                                        />
                                    </Col>

                                    <Col className='mt-50'>
                                        <Button.Ripple color='primary' onClick={EditEbook} >
                                            {t('Edit book')}
                                        </Button.Ripple>
                                    </Col>

                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <TestCropper
                isOpen={selectedImage && isModalOpen}
                Image={selectedImage}
                type={currentType}
                onCrop={onCrop}
                toggleModal={toggleModal} />

        </UILoader>
    )
}


const mapStateToProps = (state) => {
    const {
        putEbookSuccess,
        putEbookError,
        putEbookLoading
    } = state.Ebook

    return {
        putEbookSuccess,
        putEbookError,
        putEbookLoading
    }

}

const mapDispatchToProps = {
    putEbook
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditEbook))