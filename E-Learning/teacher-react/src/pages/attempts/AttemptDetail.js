import React from 'react';

import {
    Row,
    Col,
} from 'reactstrap';

import { connect } from 'react-redux'
import { useEffect } from 'react';
import { getAttemptDetail, getTestDetail, putSubjectiveAttemptMarks } from '@store/actions';
import { withRouter } from 'react-router-dom';
import TestDetail from '../tests/TestDetail';
import Question from '../questions/attempt/Question'
import '../../assets/scss/custom/components/_card.scss'

import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import UILoader from '../../@core/components/ui-loader';
import { infoAlertDialog, successAlertDialog, errorAlertDialog } from '../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';
const AttemptDetail = (props) => {

    const attemptId = props.match.params.attemptId;
    const updatedAttemptQuestions = []
    const {t} = useTranslation()

    const {
        attemptDetail,
        updateAttemptLoading,
        putSubjectiveAttemptMarks,
        updateAttemptSuccess,
        updateAttemptError
    } = props;

    const test = attemptDetail.test

    const getAttemptAndTestDetail = () => {
        props.getAttemptDetail(attemptId)
    }

    const updateQuestions = (question) => {
        let index = updatedAttemptQuestions.map(q => q.questionId).indexOf(question.questionId)
        index > -1
            ? updatedAttemptQuestions[index] = question
            : updatedAttemptQuestions.push(question)

    }

    const onUpdateAttemptSubjectiveMarks = () => {
        if (updatedAttemptQuestions.length == attemptDetail.subjectiveAttempt.length)
            putSubjectiveAttemptMarks(attemptId, updatedAttemptQuestions)
        else infoAlertDialog(t("Enter number for all subjective questions"))
    }


    useEffect(getAttemptAndTestDetail, []);

    useEffect(() => {
        if (updateAttemptSuccess) successAlertDialog(t('Attempt marks update successfully'));
    }, [updateAttemptSuccess]);

    useEffect(() => {
        if (updateAttemptError && !updateAttemptSuccess) errorAlertDialog(t("Attempt marks could not be updated"));
    }, [updateAttemptError]);

    return (
        <>
            <UILoader blocking={updateAttemptLoading}>
                {
                    attemptDetail &&
                    attemptDetail.objectiveAttempt &&
                    attemptDetail.subjectiveAttempt && (
                        <Row>
                            <Col lg={12}>
                                <TestDetail test={props.attemptDetail.test} isUpdateMarks={true} onUpdateMarks={onUpdateAttemptSubjectiveMarks} />
                            </Col>
                            {
                                attemptDetail.objectiveAttempt.map(
                                    (answer, index) => (
                                        <Col
                                            lg={12}
                                            key={`objective-question-${index + 1}`}>
                                            <Question
                                                question={test.questions.find(q => q._questionId === answer.questionId)}
                                                answer={answer}
                                                number={index + 1}
                                            />

                                        </Col>
                                    )
                                )
                            }
                            {
                                attemptDetail.subjectiveAttempt.map(
                                    (answer, index) => (
                                        <Col
                                            lg={12}
                                            key={`subjective-question-${index + 1}`}>
                                            <Question
                                                question={test.questions.find(q => q._questionId === answer.questionId)}
                                                answer={answer}
                                                updateQuestions={updateQuestions}
                                                number={index + 1}
                                            />
                                        </Col>
                                    )
                                )

                            }

                        </Row>
                    )
                }
            </UILoader>
        </>);
};

const mapStateToProps = (state) => {
    const { testDetail,
        attemptDetail,
        attemptDetailLoading,
        attemptDetailError,
        updateAttempt,
        updateAttemptLoading,
        updateAttemptSuccess,
        updateAttemptError } = state.Attempts;
    return {

        testDetail,
        attemptDetail,
        attemptDetailLoading,
        attemptDetailError,

        updateAttempt,
        updateAttemptLoading,
        updateAttemptSuccess,
        updateAttemptError
    };
}

const mapDispatchToProps = {
    getAttemptDetail, getTestDetail, putSubjectiveAttemptMarks
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AttemptDetail))


