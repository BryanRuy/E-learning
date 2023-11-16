import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'


// ** Third Party Components
import {
    Card, CardBody, Row, Col,
    Button,
    CardTitle,
    CardHeader,
    FormGroup,
    Input

} from 'reactstrap'
import { useTranslation } from 'react-i18next';

// ** Store & Actions
import { connect } from 'react-redux'
import {
    newTestAttempt, submitTestAttempt,
    updateObjectiveQuestion,
    updateSubjectiveQuestion,
    nextQuestion,
    previousQuestion,
    selectQuestion
} from './store/actions'
import { withRouter } from 'react-router';
import { ArrowLeft, ArrowRight, X } from 'react-feather'
import UILoader from '../../@core/components/ui-loader';
import { GET_DOCUMENT_URL } from '../../helpers/url_helper'
import moment from 'moment';
import { notifyError, notifySuccess } from '../../utility/toast'

import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import './style.scss'

import { Modal, ModalBody } from 'reactstrap'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


const AttemptTest = (props) => {

    const {t} = useTranslation()
    const [isTimeOver, setIsTimeOver] = useState(false)
    const [isTestSubmitted, setIsTestSubmitted] = useState(false)

    const [timer, setTimer] = useState(null)
    const [timeLeft, setTimeLeft] = useState("")
    const [remainingSeconds, setRemainingSeconds] = useState(86400);
    const [isShowAllQuestions, setIsShowAllQuestions] = useState(false)

    useEffect(() => {
        if (isTimeOver == false) {
            if (remainingSeconds <= 0) {
                setIsTimeOver(true)
                handleTimeOver()
                setTimeout(submitTest, 1000)
            }
        }
    }, [remainingSeconds])

    const handleTimeOver = () => {
        return MySwal.fire({
            title: t("Test Over"),
            text: t('Test is submitted'),
            timer: 2000,
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            showClass: {
                popup: 'animate__animated animate__flipInX'
            },
            buttonsStyling: false
        })
    }

    const handleTestSubmit = () => {
        return MySwal.fire({
            icon: 'question',
            title: t("Confirm"),
            text: `${t('You have attempted')} ${(getAttemptedQuestions()).length}/${props.selectedTest.test.questions.length} ${t('questions')}. ${t('Are you sure to submit this test?')}`,
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                submitTest()
            }
        })
    }

    const updateTimeLeft = () => {
        if (props.selectedTest && props.selectedTest.test.timeLimit && props.testStartTime) {
            let start = moment.utc(props.testStartTime).local().add(props.selectedTest.test.timeLimit, 'seconds')
            let currentTime = moment.utc().local();
            let rem = moment.duration(start.diff(currentTime)).asSeconds();
            if (rem >= -5) {
                setRemainingSeconds(rem);
                let hours = String(Math.floor(rem / 3600.0)).padStart(2, '0');
                let minutes = String(Math.floor((rem % 3600.0) / 60)).padStart(2, '0');
                let seconds = String(Math.floor((rem % 3600.0) % 60)).padStart(2, '0')
                setTimeLeft(`${hours}: ${minutes}: ${seconds}`);
            }
        }

    }

    useEffect(() => {
        if (Object.keys(props.selectedTest).length == 0) {
            if (timer) {
                clearInterval(timer)
                setTimer(null)
            }
            props.history.goBack()
        } else {
            if (!timer) {
                setTimer(setInterval(updateTimeLeft, 1000))
            }
        }
    }, [props.selectedTest])

    useEffect(() => {
        if (!props.submitTestLoading && isTestSubmitted && props.submitTestError) {
            notifyError(t("Test Submit"), props.submitTestError)
        }
        else if (!props.submitTestLoading && isTestSubmitted && !props.submitTestError) {
            notifySuccess(t("Test Submit"), t('Test Submitted Successfully'))
        }
    }, [props.submitTestLoading])

    const getAttemptedQuestions = () => {
        return props.selectedTest.test.questions.filter(q => {
            if (q.type == 1 && q.options.find(o => o.selected)) {
                return true
            } else if (q.type == 2 && q.answerText) {
                return true
            }
            return false
        })
    }

    const submitTest = () => {

        let attemptedQuestions = getAttemptedQuestions();

        let data = {
            attemptId: props.attemptId,
            questions: attemptedQuestions.map(q => {
                if (q.type == 1) {
                    return {
                        type: 1,
                        questionId: q.questionId,
                        optionId: q.options.find(o => o.selected).optionId
                    }
                } else {
                    return {
                        type: 2,
                        questionId: q.questionId,
                        answerText: q.answerText
                    }
                }
            })
        }
        setIsTestSubmitted(true)
        props.submitTestAttempt(data)
    }


    const Question = (question) => {
        return <div
            key={'question-key' + question.questionId}
            className="question "
        >
            {
                question.image &&
                <div className="mb-1">
                    <img className="question-img" src={GET_DOCUMENT_URL(question.image)} />
                </div>
            }
            <Row>
                <Col sm='12' md='8' lg='10'>
                    <h5>
                        {props.currentIndex + 1}.&nbsp;{question.text}
                    </h5>
                </Col>
                <Col sm='12' md='4' lg='2'>
                    <h6 className="text-secondary ml-1 text-right">
                        Marks: {question.marks}
                    </h6>
                </Col>
            </Row>
            <div className="mt-2">
                {
                    question.type == 1 &&
                    question.options.map((o, index) =>
                        <Button.Ripple
                            block
                            outline={!o.selected}
                            color='primary'
                            className="text-left"
                            key={'object-option-' + index}
                            onClick={() => props.updateObjectiveQuestion({ id: o.optionId })}
                        >
                            {o.optionText}
                        </Button.Ripple>
                    )
                }
                {question.type == 2 &&
                    <FormGroup className='mb-2'>
                        <Input
                            className='mb-2'
                            type='textarea'
                            rows='4'
                            placeholder={t('Write answer here')}
                            value={question.answerText}
                            onChange={e => props.updateSubjectiveQuestion({ value: e.target.value })}
                            required
                        />
                    </FormGroup>
                }
            </div>
        </div>
    }

    const showAllQuestions = () => {
        return props.selectedTest.test.questions.map((q, index) =>
            <Button.Ripple
                key={'question-list-selection-key' + index}
                color='primary'
                outline={props.currentIndex != index}
                className="ml-25 mb-25"
                onClick={() => {
                    props.selectQuestion({ index })
                    setIsShowAllQuestions(false)
                }}
            >
                {
                    index + 1
                }
            </Button.Ripple>
        )
    }

    return (
        <Fragment>
            <UILoader blocking={props.submitTestLoading} >
                {
                    Object.keys(props.selectedTest).length > 0 &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {props.selectedTest.test.title}
                            </CardTitle>
                            <div className="text-right">
                                {t('TimeLeft')}
                                <h3>{timeLeft ? timeLeft : '00:00:00'}</h3>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {
                                Object.keys(props.selectedTest).length > 0 &&
                                props.selectedTest.test.questions[props.currentIndex] &&
                                Question(props.selectedTest.test.questions[props.currentIndex])
                            }
                            {
                                Object.keys(props.selectedTest).length > 0 &&
                                props.selectedTest.test.questions.length > 0 &&
                                <Row className="mt-4">
                                    <Col md='8'>
                                        <div className="pt-1 text-sm-center text-md-left">
                                            {
                                                props.currentIndex > 0 &&
                                                <Button.Ripple
                                                    color='primary'
                                                    outline
                                                    onClick={() => props.previousQuestion()}
                                                >
                                                    <ArrowLeft size={14} />
                                                </Button.Ripple>
                                            }
                                            <Button.Ripple
                                                className="mr-25 ml-25"
                                                color='primary'
                                                outline
                                                onClick={() => setIsShowAllQuestions(true)}
                                            >
                                                {
                                                    props.currentIndex + 1
                                                }
                                            </Button.Ripple>
                                            {
                                                props.currentIndex < props.selectedTest.test.questions.length - 1
                                                &&
                                                <Button.Ripple
                                                    color='primary'
                                                    outline
                                                    onClick={() => props.nextQuestion()}
                                                >
                                                    <ArrowRight size={14} />
                                                </Button.Ripple>
                                            }
                                        </div>
                                    </Col>
                                    <Col md='4' >
                                        <div className="pt-1 text-sm-center text-md-right">
                                            <Button.Ripple
                                                color='primary'
                                                onClick={handleTestSubmit}
                                            >
                                                {t('Submit')}
                                            </Button.Ripple>
                                        </div>
                                    </Col>
                                </Row>
                            }
                        </CardBody>
                    </Card>
                }
            </UILoader>
            {
                Object.keys(props.selectedTest).length > 0 &&
                <Modal
                    isOpen={isShowAllQuestions}
                    toggle={() => setIsShowAllQuestions(false)}
                    className='modal-dialog-centered'
                >
                    <ModalBody className="pb-1">
                        <div className="text-right">
                            <X
                                size={16}
                                onClick={() => setIsShowAllQuestions(false)}
                            />
                        </div>
                        <h6>
                            {props.selectedTest.test.title}
                        </h6>
                        <div className="mt-1">
                            {
                                showAllQuestions()
                            }
                        </div>
                    </ModalBody>
                </Modal>
            }
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        tests,
        testsLoading,
        testsError,
        attemptTestLoading,
        selectedTest,
        currentIndex,
        attemptId,
        attemptTestError,
        submitTestLoading,
        submitTestError,
        testStartTime

    } = state.Tests;
    return {
        tests,
        testsLoading,
        testsError,
        attemptTestLoading,
        selectedTest,
        currentIndex,
        attemptId,
        attemptTestError,
        submitTestLoading,
        submitTestError,
        testStartTime
    }
}

export default withRouter(
    connect(mapStateToProps, {
        newTestAttempt, submitTestAttempt,
        updateObjectiveQuestion,
        updateSubjectiveQuestion,
        nextQuestion,
        previousQuestion,
        selectQuestion
    })(AttemptTest)
)
