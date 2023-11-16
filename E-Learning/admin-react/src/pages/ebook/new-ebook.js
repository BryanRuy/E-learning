
import React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Input, Form, FormGroup, Button, Label } from "reactstrap"
import ImagePickerWithPreview from "./image-picker-with-preview"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import {
    postEbook,
} from '@store/actions'
import TestCropper from "./cropper"
import UILoader from '../../@core/components/ui-loader';
import { errorAlertDialog, successAlertDialog } from "../../helpers/HelperFunctions"
import { useTranslation } from 'react-i18next'
const filePlaceholder = require(`@src/assets/images/custom-placeholder/file_preview_placeholder.jpg`);
const imgPlaceholder = require(`@src/assets/images/custom-placeholder/img_preview_placeholder.jpeg`);


const CreateEbook = (props) => {

    const { t } = useTranslation()
    const { postEbookSuccess,
        postEbookError,
        postEbookLoading } = props

    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [price, setPrice] = useState()
    const [currentType, setCurrentType] = useState()

    const [selectedImage, setSelectedImage] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [coverImageThumbnail, setCoverImageThumbnail] = useState(imgPlaceholder)
    const [coverOrignalFile, setCoverOrignalFile] = useState(null)

    const [previewImageThumbnail, setPreviewImageThumbnail] = useState(imgPlaceholder)
    const [previewOrignalFile, setPreviewOrignalFile] = useState(null)

    const [bookUrl, setBookUrl] = useState(filePlaceholder)
    const [bookFile, setBookFile] = useState(null)


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
                setCoverOrignalFile(files[0])
            }
            else if (selectedFile == 'preview') {
                setSelectedImage(reader.result)
                setPreviewOrignalFile(files[0])
            }

            else if (selectedFile == 'bookUrl') {
                setBookFile(files[0])
            }
        }
        reader.readAsDataURL(files[0])
    }

    const onCrop = (type, cropImage) => {
        if (type == 'cover') {
            setCoverImageThumbnail(cropImage)
        }
        if (type == 'preview') {
            setPreviewImageThumbnail(cropImage)
        }
        setSelectedImage(null)
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }


    const AddEbook = async () => {
        
        if(!coverImageThumbnail){errorAlertDialog('Please select a cover Image'); return}
        if(!previewImageThumbnail){errorAlertDialog('Please select a preview Image'); return}
        if(!bookFile){errorAlertDialog('Please select a book file'); return}
        if(!title){errorAlertDialog('Please enter book title'); return}
        if(!description){errorAlertDialog('Please enter book description'); return}
        if(!price){errorAlertDialog('Please enter book price'); return}
        
        const fd = new FormData();
        var coverBlobData = await fetch(coverImageThumbnail)
        var coverBlob = await coverBlobData.blob()
        var coverFile = new File([coverBlob], coverOrignalFile.name);
        
        var previewBlobData = await fetch(previewImageThumbnail)
        var previewBlob = await previewBlobData.blob()
        var previewFile = new File([previewBlob], previewOrignalFile.name);
        
        if (coverFile) fd.append(`coverImage`, coverFile, coverFile.name);
        if (previewFile) fd.append(`previewImage`, previewFile, previewFile.name);
        if (bookFile) fd.append(`bookUrl`, bookFile, bookFile.name);
        fd.append(`title`, title);
        fd.append(`description`, description);
        fd.append(`price`, price);
        fd.append(`priceInCents`, price*100);
        
        props.postEbook(fd)
    }

    useEffect(() => {
        if (postEbookError) errorAlertDialog(postEbookError)
        if (postEbookSuccess) successAlertDialog(t("Ebook saved successfully"))
    }, [postEbookError, postEbookSuccess])


    return (
        <UILoader blocking={postEbookLoading}>
            <Row>
                <Col sm='12'>
                    <Card>
                        <CardBody>

                            <Form className='mt-2' onSubmit={e => e.preventDefault()}>
                                <Row>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Title')}</Label>
                                            <Input id='blog-edit-title' value={title} onChange={e => setTitle(e.target.value)}/>
                                        </FormGroup>
                                    </Col>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Description')}</Label>
                                            <Input id='blog-edit-title' value={description} onChange={e => setDescription(e.target.value)}/>
                                        </FormGroup>
                                    </Col>

                                    <Col md='4'>
                                        <FormGroup className='mb-2'>
                                            <Label for='blog-edit-title'>{t('Price')}</Label>
                                            <Input type="number" id='blog-edit-title' value={price} onChange={e => setPrice(e.target.value)}/>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className='mb-2' sm='12' md='6'>
                                        <ImagePickerWithPreview
                                            Image={coverImageThumbnail}
                                            type={"cover"}
                                            lblTitle={t("Cover Image")}
                                            acceptType={'.jpg, .png, .jpeg'}
                                            onChange={onChange}
                                        />
                                    </Col>

                                    <Col className='mb-2' sm='12' md='6'>
                                        <ImagePickerWithPreview
                                            Image={previewImageThumbnail}
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
                                        <Button.Ripple color='primary' onClick={AddEbook} >
                                           {t('Add book')}
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
        postEbookSuccess,
        postEbookError,
        postEbookLoading
    } = state.Ebook

    return {
        postEbookSuccess,
        postEbookError,
        postEbookLoading
    }

}

const mapDispatchToProps = {
    postEbook
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEbook))