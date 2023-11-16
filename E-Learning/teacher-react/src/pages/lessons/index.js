import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import {
    Card, CardBody, Row, Col,
    Button,
    CardTitle,
    CardHeader,
    Modal, ModalBody, Input, InputGroup, FormGroup, Label, Form, CustomInput
} from 'reactstrap'

// ** Store & Actions
import { connect, useSelector } from 'react-redux'
import {
    getTeacherTopicLessons,
    getTeacherTopics,
    selectTopic,
    selectLesson,
    addNewTopic, updateTopic,
    getTeacherRecentLessons,
    deleteTopic
} from './store/actions'

import { withRouter } from 'react-router';
import { GET_BLOG_IMAGE_URL } from '../../helpers/url_helper'

import { Plus, Trash2, X, Edit } from 'react-feather'

import UILoader from '../../@core/components/ui-loader';
import Table from 'reactstrap/lib/Table';

import { DateTime } from '../../components/date-time';

import { notifyError, notifySuccess } from '../../utility/toast'

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';


import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'

import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'


import './style.scss'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useTranslation } from 'react-i18next';

let placeHolder = require("../../assets/images/icons/image-placeholer.svg")

const MySwal = withReactContent(Swal)

const AppLessons = (props) => {

    const { t } = useTranslation()
    const [isNewTopic, setIsNewTopic] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)
    const [isTopicDeleting, setIsTopicDeleting] = useState(false)
    const [url, setUrl] = useState("")
    const [updateTopicId, setUpdateTopicId] = useState(null)

    const uppy = new Uppy({
        meta: { type: 'avatar' },
        onBeforeFileAdded: (currentFile, files) => {
            if (currentFile && currentFile.data)
                setFile(currentFile.data);
        },
        restrictions: { maxNumberOfFiles: 1 },
        autoProceed: true
    })

    uppy.use(thumbnailGenerator)

    uppy.on('thumbnail:generated', (file, preview) => {
        setUrl(preview)
    })

    useEffect(() => {
        props.getTeacherTopics()
        props.getTeacherRecentLessons()
    }, [])

    useEffect(() => {
        if (isTopicDeleting && !props.topicDeleting && props.topicDeleteError) {
            setIsTopicDeleting(false)
            notifyError(t("Delete Topic"), props.topicDeleteError)
        } else if (isTopicDeleting && !props.topicDeleting && !props.topicDeleteError) {
            setIsTopicDeleting(false)
            notifySuccess(t("Delete Topic"), t("Topic deleted successfully"))
        }
    }, [props.topicDeleting])

    useEffect(() => {
        if (isNewTopic && !props.newTopicUploading && !props.newTopicError) {
            closeTopic()
            notifySuccess(t("New Topic"), t("Topic Added successfully"))
        }
        else if (isNewTopic && !props.newTopicUploading && props.newTopicError) {
            notifyError(t("New Topic"), props.newTopicError)
        }

    }, [props.newTopicUploading])

    useEffect(() => {
        if (updateTopicId && !props.updateTopicUploading && !props.updateTopicError) {
            closeTopic()
            notifySuccess(t("Update Topic"), t("Topic updated successfully"))
        }
        else if (updateTopicId && !props.updateTopicUploading && props.updateTopicError) {
            notifyError(t("Update Topic"), props.updateTopicError)
        }

    }, [props.updateTopicUploading])

    const submitTopic = (e) => {
        e.preventDefault()
        if (updateTopicId) {
            let data = new FormData();
            data.append("id", updateTopicId)
            data.append("title", title)
            data.append("description", description)
            data.append("file", file)
            props.updateTopic(data);
            return
        }
        if (!file) return notifyError(t("New Topic"), t("Image is required for new topic"))
        props.addNewTopic({
            title,
            description,
            file
        })
    }

    const closeTopic = () => {
        setTitle("")
        setDescription("")
        setFile(null);
        setIsNewTopic(false)
        setUpdateTopicId(null)
        setUrl(null)
    }

    const goToTopicDetails = (id) => {
        props.selectTopic(id)
        props.history.push('/topic-lessons')
    }

    const handleTopicDelete = (id) => {
        return MySwal.fire({
            icon: 'question',
            title: `${t("Confirm")}`,
            text: `${t('Are you sure to delete this topic?')}`,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ml-1'
            },
            confirmButtonText: "Yes",
            buttonsStyling: false,
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                setIsTopicDeleting(true)
                props.deleteTopic(id)
            }
        })
    }

    const editTopic = (t) => {
        setUpdateTopicId(t.id);
        setTitle(t.title);
        setDescription(t.description);
        setUrl(GET_BLOG_IMAGE_URL(t.image.formats.thumbnail.url));
    }

    return (
        <Fragment >
            <UILoader
                blocking={
                    props.topicsLoading ||
                    props.recentLessonsLoading ||
                    props.topicDeleting
                }>
                <Card >
                    <CardBody className='p-0'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-primary'>{t('Topics')}</CardTitle>
                                <div className="text-right">
                                    <Button.Ripple
                                        color='primary'
                                        onClick={() => setIsNewTopic(true)}
                                    >
                                        <Plus size={14} />
                                        &nbsp;
                                        {t('New Topic')}
                                    </Button.Ripple>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {
                                    props.topics.length == 0 &&
                                    !props.topicsLoading &&
                                    !props.topicsError &&
                                    <NotFound message={"Add some topics"} />
                                }
                                {
                                    !props.topicsLoading &&
                                    props.topicsError &&
                                    <NoNetwork />
                                }
                                {
                                    props.topics.length > 0 &&
                                    <Row className="pt-1">
                                        {
                                            props.topics.map((t, index) =>
                                                <Col
                                                    key={'topic-key-' + index}
                                                    sm='12' md='6' lg='6'
                                                    className='pl-1 pr-1 pb-1 '
                                                >
                                                    <div
                                                        className={`teacher-topic-item`}
                                                    >
                                                        <div
                                                            className="topic-image"
                                                            onClick={() => goToTopicDetails(t.id)}
                                                            style={{
                                                                backgroundImage: `url(${GET_BLOG_IMAGE_URL(t.image.formats.thumbnail.url)})`
                                                            }}
                                                        >
                                                        </div>
                                                        <div className="topic-content">
                                                            <div
                                                                className="heading"
                                                                onClick={() => goToTopicDetails(t.id)}
                                                            >
                                                                {t.title}
                                                            </div>
                                                            <div className="description">
                                                                {t.description}
                                                            </div>
                                                            <div className="actions text-right">
                                                                <Button.Ripple
                                                                    color='flat-secondary'
                                                                    onClick={() => editTopic(t)}
                                                                >
                                                                    <Edit size={14} />
                                                                </Button.Ripple>
                                                                <Button.Ripple
                                                                    color='flat-danger'
                                                                    onClick={() => handleTopicDelete(t.id)}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button.Ripple>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                }
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-primary">{t('Recent Lessons')}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {
                                    props.recentLessons.length == 0 &&
                                    !props.recentLessonsLoading &&
                                    !props.recentLessonsError &&
                                    <NotFound />
                                }
                                {
                                    !props.recentLessonsLoading &&
                                    props.recentLessonsError &&
                                    <NoNetwork />
                                }
                                {
                                    props.recentLessons.length > 0 &&
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>{t('Lesson')}</th>
                                                <th>{t('Topic')}</th>
                                                <th>{t('Uploaded')}</th>
                                                <th>{t('Students')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                props.recentLessons.map((l, index) =>
                                                    <tr key={'recent_lesson_' + index}
                                                        onClick={() => {
                                                            props.selectTopic(l.topic.id)
                                                            props.selectLesson(l.id)
                                                            props.history.push("/topic-lessons")
                                                        }}
                                                    >
                                                        <td>
                                                            {l.title}
                                                        </td>
                                                        <td>
                                                            {l.topic.title}
                                                        </td>
                                                        <td>
                                                            <DateTime dateTime={l.created_at} />
                                                        </td>
                                                        <td>
                                                            {l.assignToStudents}
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                }
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
                <Modal
                    isOpen={isNewTopic || updateTopicId}
                    className='modal-dialog-centered'
                >
                    <UILoader
                        blocking={props.newTopicUploading ||
                            props.updateTopicUploading}
                        className="model-loader"
                    >
                        <ModalBody className="pb-1">
                            <div className="text-right">
                                <X
                                    size={16}
                                    onClick={() => closeTopic()}
                                />
                            </div>
                            <h6>
                                {
                                    updateTopicId ?
                                        t("Update Topic") :
                                        t("New Topic")
                                }
                            </h6>
                            <Form
                                className="mt-1 mb-2"
                                onSubmit={e => submitTopic(e)}
                            >
                                <FormGroup>
                                    <Label className="ml-25">
                                        {t('Title')}
                                    </Label>
                                    <InputGroup className='input-group-merge'>
                                        <Input
                                            type="text"
                                            placeholder={t('Title')}
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            required />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label className="ml-25">
                                        {t('Description')}
                                    </Label>
                                    <InputGroup className='input-group-merge'>
                                        <Input
                                            type='textarea'
                                            rows='4'
                                            placeholder={t('Description')}
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <div className="topic-img">
                                    <DragDrop uppy={uppy} />
                                    {url &&
                                        <div className="image-preview mt-2">
                                            {file && <X
                                                className="clear-icon text-primary"
                                                size={20}
                                                onClick={() => {
                                                    setFile(null)
                                                    setUrl("")
                                                }}
                                            />}
                                            <img className='rounded ' src={url} alt='avatar' />
                                        </div>
                                    }
                                </div>
                                <FormGroup className="mt-2">
                                    <Button.Ripple
                                        type="submit"
                                        color='primary'
                                    >
                                        {t('Submit')}
                                    </Button.Ripple>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                    </UILoader>
                </Modal >
            </UILoader>
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        topics,
        topicsLoading,
        topicsError,
        lessons,
        lessonsLoading,
        lessonsError,
        selectedTopic,
        selectedLesson,
        recentLessons,
        recentLessonsLoading,
        recentLessonsError,
        newTopicUploading,
        newTopicError,
        topicDeleting,
        topicDeleteError,
        updateTopicUploading,
        updateTopicError,

    } = state.Lessons;
    return {
        topics,
        topicsLoading,
        topicsError,
        lessons,
        lessonsLoading,
        lessonsError,
        selectedTopic,
        selectedLesson,
        recentLessons,
        recentLessonsLoading,
        recentLessonsError,
        newTopicUploading,
        newTopicError,
        topicDeleting,
        topicDeleteError,
        updateTopicUploading,
        updateTopicError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getTeacherTopicLessons, getTeacherTopics,
        selectTopic, selectLesson, addNewTopic, updateTopic,
        getTeacherRecentLessons, deleteTopic
    })(AppLessons)
)
