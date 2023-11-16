
/**
 * Rich Text Editor - Getting Started Sample
 */
import React, { Fragment, useEffect, useState } from 'react';

// ** Third Party Components
import {
    Card, CardBody, FormGroup, Input, Form, Label, Button, InputGroup
} from 'reactstrap'


// ** Store & Actions
import { connect, } from 'react-redux'
import { addNewLesson, updateLesson } from './store/actions'

import { withRouter } from 'react-router';
import './style.scss'

import UILoader from '../../@core/components/ui-loader';


import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'

import { EditorState } from 'draft-js';
import { Editor, } from 'react-draft-wysiwyg';

import { notifyError, notifySuccess } from '../../utility/toast'
import { ArrowLeft } from 'react-feather'
import { stateToMarkdown } from "draft-js-export-markdown";
import { stateFromMarkdown } from 'draft-js-import-markdown';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next';


const newLesson = (props) => {

    const { t } = useTranslation()
    const [editorVal, setEditorVal] = useState();
    const [myEditorVal, setMyEditorVal] = useState(() => EditorState.createEmpty());
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [lessonForUpdate, setLessonForUpdate] = useState({})
    const [isNewLesson, setIsNewLesson] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [isPreview, setIsPreview] = useState(false)

    const lessonContentRef = React.createRef()

    const handleEditorChange = (state) => {
        setEditorState(state);

        let content = stateToMarkdown(state.getCurrentContent())
        setEditorVal(content)
    }

    useEffect(() => {
        if (!props.selectedTopic) {
            props.history.goBack()
        }
        if (props.location.state) setLessonForUpdate(props.location.state)
    }, [props.selectedTopic])

    useEffect(() => {
        if (Object.keys(lessonForUpdate).length > 0) {
            setTitle(lessonForUpdate.title);
            setDescription(lessonForUpdate.description)
            setVideoUrl(lessonForUpdate.videoUrl || "")
            let contentState = stateFromMarkdown(lessonForUpdate.content, { parserOptions: { atomicImages: true } })
            setEditorState(EditorState.createWithContent(contentState))
        }
    }, [lessonForUpdate])

    useEffect(() => {
        if (isNewLesson && !props.newLessonUploading && !props.newLessonError) {
            setIsNewLesson(false)
            notifySuccess(t("New Lesson"), t("Lesson Added successfully"))
            props.history.goBack()
        }
        else if (isNewLesson && !props.newLessonUploading && props.newLessonError) {
            setIsNewLesson(false)
            notifyError(t("New Lesson"), props.newLessonError)
        }
    }, [props.newLessonUploading])

    useEffect(() => {
        if (Object.keys(lessonForUpdate).length > 0 && !props.updateLessonLoading && !props.updateLessonError) {
            notifySuccess(t("Update Lesson"), t("Lesson updated successfully"))
            props.history.goBack()
        }
        else if (Object.keys(lessonForUpdate).length > 0 && !props.updateLessonLoading && props.updateLessonError) {
            notifyError(t("Update Lesson"), props.updateLessonError)
        }
    }, [props.updateLessonLoading])

    const youTubeParser = (url) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : "";
    }

    const getVideoThumbnailUrl = (url) => {
        let id = youTubeParser(url)
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    }

    const getVideoLink = (url) => {
        return `https://youtube.com/embed/${youTubeParser(url)}`
    }

    const submitLesson = (e) => {
        e.preventDefault();
        if (!editorState.getCurrentContent().hasText()) {
            return notifyError(`${Object.keys(lessonForUpdate).length > 0 ?
                "Update" : "New"} Lesson`,
                t("Content is required for lesson"))
        }
        if (Object.keys(lessonForUpdate).length > 0) {
            props.updateLesson({
                id: lessonForUpdate.id,
                topic: props.selectedTopic,
                title,
                description,
                content: stateToMarkdown(editorState.getCurrentContent()),
                videoUrl: videoUrl ? getVideoLink(videoUrl) : null
            })
            return
        }
        setIsNewLesson(true)
        props.addNewLesson({
            topic: props.selectedTopic,
            title,
            description,
            content: stateToMarkdown(editorState.getCurrentContent()),
            videoUrl: videoUrl ? getVideoLink(videoUrl) : null
        })
    }

    const renderLesson = () => {
        let content = stateToMarkdown(editorState.getCurrentContent())
        if (content) {
            let fun = () => {
                if (lessonContentRef.current) {
                    render(<ReactMarkdown>{content}</ReactMarkdown>, lessonContentRef.current)
                } else {
                    setTimeout(fun, 100)
                }
            }
            setTimeout(fun, 100)
        }
    }

    return (
        <Fragment >
            <UILoader
                blocking={props.newLessonUploading || props.updateLessonLoading}>
                <Card >
                    <CardBody>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="d-none d-lg-inline d-xl-inline">
                                    <Button.Ripple
                                        className='btn-block btn-icon'
                                        color='flat-primary'
                                        onClick={() => {
                                            props.history.goBack()
                                        }}
                                    >
                                        <ArrowLeft size={14} />
                                    </Button.Ripple>
                                </div>
                                <h4 className="text-primary ml-25 mb-0">
                                    {Object.keys(lessonForUpdate).length > 0 ? "Update" : "New"} {t('Lesson')}
                                </h4>
                            </div>
                            <div>
                                <Button.Ripple
                                    color='primary'
                                    onClick={() => setIsPreview(!isPreview)}
                                >
                                    {isPreview ? `${t("Exit Preview")}` : `${t("Preview")}`}
                                </Button.Ripple>

                            </div>
                        </div>
                        {
                            props.selectedTopic &&
                            <h6 className="ml-25 mb-0">
                                {
                                    props.topics.find(t => t.id == props.selectedTopic).title
                                }
                            </h6>
                        }
                        {
                            isPreview ?
                                <div className="active-lesson">
                                    <h3 className="mt-1">
                                        {title}
                                    </h3>
                                    {
                                        videoUrl &&
                                        <div className="mt-1 lesson-video">
                                            <iframe
                                                type="text/html"
                                                src={getVideoLink(videoUrl)}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            >
                                            </iframe>
                                        </div>
                                    }
                                    <div ref={lessonContentRef}
                                        id="active-lesson-content"
                                        className="mt-3" >
                                    </div>
                                    {
                                        renderLesson()
                                    }
                                </div>
                                : <Form
                                    className="mt-1 mb-2"
                                    onSubmit={e => submitLesson(e)}
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
                                                required
                                            />
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
                                    <FormGroup>
                                        <Label className="ml-25 ">
                                            {t('Content')}
                                        </Label>
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={handleEditorChange}
                                            wrapperClassName="wrapper-class"
                                            editorClassName="editor-class"
                                            toolbarClassName="toolbar-class"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label className="ml-25">
                                            {t('Video Url')}
                                        </Label>
                                        <InputGroup className='input-group-merge'>
                                            <Input
                                                type='url'
                                                placeholder={t('Video url')}
                                                value={videoUrl}
                                                onChange={e => setVideoUrl(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    {
                                        videoUrl &&
                                        <FormGroup>
                                            <img
                                                src={getVideoThumbnailUrl(videoUrl)}
                                                className="rounded  new-lesson-thumbnail"
                                                alt={t("Not Valid Url")}/>
                                        </FormGroup>
                                    }
                                    <Button.Ripple
                                        type="submit"
                                        color='primary'
                                        className='mt-2'
                                    >
                                        {t('Submit')}
                                    </Button.Ripple>
                                </Form>
                        }
                    </CardBody>
                </Card>
            </UILoader>
        </Fragment >
    );

}


const mapStateToProps = (state) => {

    const {
        topics,
        selectedTopic,
        newLessonUploading,
        newLessonError,
        updateLessonLoading,
        updateLessonError

    } = state.Lessons;
    return {
        topics,
        selectedTopic,
        newLessonUploading,
        newLessonError,
        updateLessonLoading,
        updateLessonError
    }
}

export default withRouter(
    connect(mapStateToProps, {
        addNewLesson, updateLesson
    })(newLesson)
)
