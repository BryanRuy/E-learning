import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col,
    Button,
} from 'reactstrap'

// ** Store & Actions
import { connect, } from 'react-redux'
import {
    getAssignmentAttempt,
    getAssignment,
    createAssignmentAttempt,
    saveAnswer,
    submitAssignment
} from './store/actions'

import { withRouter, } from 'react-router';
import { useTranslation } from 'react-i18next';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import UILoader from '../../@core/components/ui-loader';
import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { DateTime } from '../../components/date-time';

import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'

import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'
import { notifyError, notifySuccess, } from '../../utility/toast';
import moment from 'moment'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import '@styles/react/libs/editor/editor.scss'
import './style.scss'

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
const MySwal = withReactContent(Swal)


const AssignmentsDetails = (props) => {

    const { t } = useTranslation()
    const [isCreateAssignment, setIsCreateAssignment] = useState(false)

    const THEORETICAL = "theoretical"
    const CODING = "coding"


    const contentRef = React.createRef()
    const answerRef = React.createRef()

    const [codeValue, setCodeValue] = useState(`// Hello World`)
    const [theoryValue, setTheoryValue] = useState(EditorState.createEmpty())

    const [isSubmitted, setIsSubmitted] = useState(false)

    const getMarkDownContent = (editorState) => {
        const content = editorState.getCurrentContent();
        const rawObject = convertToRaw(content);
        return draftToMarkdown(rawObject)
    }

    const handleEditorStateChange = (data) => {
        props.saveAnswer({
            id: props.attempt.assignmentAttemptId,
            answer: getMarkDownContent(data)
        })
        setTheoryValue(data)
    }

    const handleCodeEditorChange = (value) => {
        props.saveAnswer({
            id: props.attempt.assignmentAttemptId,
            answer: value
        })
        setCodeValue(value)
    }

    const handleAssignmentAttempt = (a) => {
        if (moment().isAfter(moment(a.startDate))
            || moment().isSame(moment(a.startDate))
            || moment().isBefore(moment(a.endDate))
            || moment().isSame(moment(a.endDate))
        ) {
            return MySwal.fire({
                icon: 'question',
                title: t("Confirm"),
                text: t('Are you sure you want to start the assignment?'),
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-danger ml-1'
                },
                showCancelButton: true,
                confirmButtonText: 'Yes',
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsCreateAssignment(true)
                    props.createAssignmentAttempt({
                        studentAssignmentId: props.selectedAssignment.studentAssignmentId
                    });
                } else {
                    props.history.goBack();
                }
            })
        }
    }
    useEffect(() => {
        if (Object.keys(props.selectedAssignment).length == 0) {
            props.history.goBack();
        }
        else if (moment().isAfter(moment(props.selectedAssignment.startDate))
            && moment().isBefore(moment(props.selectedAssignment.endDate))) {
            handleAssignmentAttempt(props.selectedAssignment)
        }
        else if (props.selectedAssignment.assignmentAttempt) {
            props.getAssignmentAttempt(
                props.selectedAssignment
                    .assignmentAttempt
                    .assignmentAttemptId)
        }
        else if (!props.selectedAssignment.assignmentAttempt) {
            props.getAssignment(props.selectedAssignment.assignment.assignmentId)
        }
    }, [props.selectedAssignment])

    useEffect(() => {
        if (isCreateAssignment && props.createAttemptError) {
            setIsCreateAssignment(false)
            notifyError(t("Assignment Attempt"), props.createAttemptError)
        }
    }, [props.createAttemptError])


    const handleSubmit = () => {
        if (!props.assignmentsAnswers[props.attempt.assignmentAttemptId]) {
            MySwal.fire({
                icon: 'warning',
                title: t("Submit Assignment"),
                text: t('Answer can not be empty'),
                customClass: {
                    confirmButton: 'btn btn-primary',
                },
                confirmButtonText: 'Yes',
                buttonsStyling: false
            })
        }
        else {
            setIsSubmitted(true)
            MySwal.fire({
                icon: 'question',
                title: t("Confirm"),
                text: t('Are you sure you want to submit the assignment?'),
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-danger ml-1'
                },
                showCancelButton: true,
                confirmButtonText: 'Yes',
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    props.submitAssignment({
                        id: props.attempt.assignmentAttemptId,
                        data: {
                            assignmentAttemptId: props.attempt.assignmentAttemptId,
                            answerText: props.assignmentsAnswers[props.attempt.assignmentAttemptId]
                        }
                    })
                }
            })
        }
    }

    useEffect(() => {
        if (isSubmitted && !props.assignmentSubmitLoading && !props.assignmentSubmitError) {
            setIsSubmitted(false)
            notifySuccess(t("Submit Assignment"), t('Assignment submitted successfully'))
        }
        else if (isSubmitted && !props.assignmentSubmitLoading && props.assignmentSubmitError) {
            setIsSubmitted(false)
            notifyError(t("Submit Assignment"), props.assignmentSubmitError)
        }
    }, [props.assignmentSubmitLoading])

    const isAttempt = () => {
        return Object.keys(props.attempt).length > 0
    }

    const isAssignmentAttemptable = () => {
        return moment().isBefore(moment(props.selectedAssignment.endDate));
    }

    const isAssignment = () => {
        return (Object.keys(props.assignment).length > 0 || props.attempt.assignment)
    }

    const updateEditorValues = (value) => {
        if (props.attempt.assignment.type == CODING)
            setCodeValue(value)
        if (props.attempt.assignment.type == THEORETICAL) {
            let rawObject = markdownToDraft(value)
            let v = convertFromRaw(rawObject)
            setTheoryValue(EditorState.createWithContent(v))
        }
    }

    useEffect(() => {
        if (isAttempt()) {
            if (props.assignmentsAnswers[props.attempt.assignmentAttemptId]) {
                updateEditorValues(props.assignmentsAnswers[props.attempt.assignmentAttemptId])
            } else if (props.attempt.answerText) {
                props.saveAnswer({
                    id: props.attempt.assignmentAttemptId,
                    answer: props.attempt.answerText
                })
                updateEditorValues(props.attempt.answerText)
            }
        }
    }, [props.attempt])

    const renderContent = () => {
        let markdown = Object.keys(props.attempt).length > 0 ? props.attempt.assignment.content
            : props.assignment.content;

        let fun = () => {
            contentRef.current ?
                render(<ReactMarkdown>{markdown}</ReactMarkdown>, contentRef.current)
                :
                setTimeout(fun, 100)
        }
        setTimeout(fun, 200)
    }

    const renderAnswer = () => {
        let markdown = props.attempt.answerText;
        let fun = () => {
            answerRef.current ?
                render(<ReactMarkdown>{markdown}</ReactMarkdown>, answerRef.current)
                :
                setTimeout(fun, 100)
        }
        setTimeout(fun, 200)
    }

    return (
        <Fragment  >
            <UILoader blocking={props.assignmentLoading || props.attemptLoading}
                className="h-100 w-100"
            >
                <Card>
                    <CardBody className="p-0 ">
                        {
                            !props.assignmentLoading &&
                            props.assignmentError &&
                            < NoNetwork />
                        }
                        {
                            !props.assignmentLoading &&
                            !props.assignmentError &&
                            !isAssignment() &&
                            < NotFound message={t("Assignment not found")} />
                        }
                        {
                            !props.assignmentLoading &&
                            !props.assignmentError &&
                            isAssignment() &&
                            <Row className="p-0 m-0 assignment-row">
                                <Col lg='5' className="assignment-content p-0 m-0 h-100 w-100 overflow-auto">
                                    <div className="w-100 d-md-flex d-lg-flex p-1 align-items-center justify-content-between assignment-actions">
                                        <div className="d-md-flex d-lg-flex ">
                                            <div className="bold text-dark d-flex d-md-block d-lg-block align-items-center justify-content-between">
                                                <h6 className="mb-0" >
                                                   {t('START TIME')}
                                                </h6>
                                                <div className=" d-inline d-md-block d-lg-block">
                                                    <small>
                                                        <DateTime dateTime={props.selectedAssignment.startDate} type="date" />
                                                    </small>
                                                </div>
                                            </div>
                                            <div
                                                className="bold text-dark ml-0 ml-md-2 ml-lg-2 mt-1 mt-md-0 mt-lg-0 d-flex d-md-block d-lg-block align-items-center justify-content-between"
                                            >
                                                <h6 className="mb-0">
                                                    {t('Deadline')}
                                                </h6>
                                                <div className="d-inline d-md-block d-lg-block">
                                                    <small>
                                                        <DateTime dateTime={props.selectedAssignment.endDate} type="date" />
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            isAttempt() &&
                                            isAssignmentAttemptable() &&
                                            <Button.Ripple color='primary'
                                                className="mt-1 mt-md-0 mt-lg-0"
                                                onClick={() => handleSubmit()}
                                            >
                                                {t('Submit')}
                                            </Button.Ripple>
                                        }
                                        {
                                            props.attempt.obtainedMarks != null &&
                                            <div className="d-flex flex-column ">
                                                <h6>
                                                    {t('Marks')}
                                                </h6>
                                                <h5>
                                                    {props.attempt.obtainedMarks}
                                                    /
                                                    {
                                                        props.attempt.assignment.totalMarks
                                                    }
                                                </h5>
                                            </div>
                                        }
                                    </div>
                                    <div className="w-100  p-2 text-dark ">
                                        <h5>
                                            {props.selectedAssignment.assignment.title}
                                        </h5>
                                        <div ref={contentRef} className="mt-2">
                                        </div>
                                        {
                                            (Object.keys(props.attempt).length > 0 ? props.attempt.assignment.content
                                                : props.assignment.content) &&
                                            renderContent()
                                        }
                                    </div>
                                </Col>
                                <Col lg='7' className="p-0 m-0 h-100 overflow-hidden">
                                    {
                                        isAttempt() ?
                                            <>
                                                {
                                                    isAssignmentAttemptable() &&
                                                    <>
                                                        {
                                                            props.selectedAssignment.assignment.type == THEORETICAL &&
                                                            <Editor
                                                                editorState={theoryValue}
                                                                onEditorStateChange={data => handleEditorStateChange(data)}
                                                            />
                                                        }
                                                        {
                                                            props.selectedAssignment.assignment.type == CODING &&
                                                            <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
                                                                <CodeEditor
                                                                    className="pb-5"
                                                                    value={codeValue}
                                                                    onValueChange={value => handleCodeEditorChange(value)}
                                                                    highlight={value => highlight(value, languages.js)}
                                                                    padding={10}
                                                                    style={{
                                                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                                                        fontSize: 12,
                                                                        minHeight: '100%',
                                                                        background: 'transparent'
                                                                    }}
                                                                />
                                                            </div>

                                                        }
                                                    </>
                                                }
                                                {
                                                    !isAssignmentAttemptable() &&
                                                    <>
                                                        {props.attempt.assignment.type == THEORETICAL ?
                                                            <div ref={answerRef} className="p-2">
                                                                {
                                                                    renderAnswer()
                                                                }
                                                            </div> :
                                                            <CodeEditor
                                                                disabled={true}
                                                                value={props.attempt.answerText}
                                                                highlight={value => highlight(value, languages.js)}
                                                                padding={10}
                                                                style={{
                                                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                                                    fontSize: 12,
                                                                }}
                                                            />
                                                        }
                                                    </>
                                                }
                                            </>
                                            :
                                            <NotFound message={t("Assignment not attempted")} />
                                    }
                                </Col>
                            </Row>
                        }
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        selectedAssignment,
        attempt,
        attemptLoading,
        attemptError,
        assignment,
        assignmentLoading,
        assignmentError,
        createAttemptLoading,
        createAttemptError,
        assignmentsAnswers,
        assignmentSubmitLoading,
        assignmentSubmitError,

    } = state.Assignments;
    return {
        selectedAssignment,
        attempt,
        attemptLoading,
        attemptError,
        assignment,
        assignmentLoading,
        assignmentError,
        createAttemptLoading,
        createAttemptError,
        assignmentsAnswers,
        assignmentSubmitLoading,
        assignmentSubmitError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getAssignmentAttempt, getAssignment, createAssignmentAttempt,
        saveAnswer, submitAssignment
    })(AssignmentsDetails)
)
