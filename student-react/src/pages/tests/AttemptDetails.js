import React, { useState } from 'react';

import {
    Row,
    Col,
} from 'reactstrap';

import { useParams } from "react-router-dom";
import { connect } from 'react-redux'
import { useEffect } from 'react';
import { getTestAttemptDetails, } from './store/actions';
import { withRouter } from 'react-router-dom';
import TestDetail from './TestDetail'
import Question from './Question'
import './_card.scss'

import UILoader from '../../@core/components/ui-loader';

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { Fragment } from 'react';

const AttemptDetails = (props) => {

    let { id } = useParams();
    useEffect(() => {
        props.getTestAttemptDetails(id)
    }, []);

    const getTestTotalMarks = () => {
        let marks = 0;
        if (Object.keys(props.attemptDetails).length == 0) return marks
        props.attemptDetails.test.questions.forEach(q => {
            props.attemptDetails.objectiveAttempt.forEach(a => {
                if (q._questionId == a.questionId && q.type == 1) {
                    if (q.options.find(o => o._optionId == a.optionId && o.isRight)) marks += q.marks
                }
            })
        });
        props.attemptDetails.subjectiveAttempt.forEach(s => marks += s.obtainedMarks)
        return marks
    }

    return (
        <Fragment>
            <UILoader blocking={props.attemptDetailsLoading}>
                {
                    !props.attemptDetailsLoading &&
                    props.attemptDetailsError &&
                    <NoNetwork message={props.attemptDetailsError} />
                }
                {
                    !props.attemptDetailsLoading &&
                    !props.attemptDetailsError &&
                    Object.keys(props.attemptDetails).length == 0 &&
                    <NotFound />
                }
                {
                    !props.attemptDetailsLoading &&
                    !props.attemptDetailsError &&
                    Object.keys(props.attemptDetails).length > 0 &&
                    <Row>
                        <Col lg={12}>
                            <TestDetail
                                test={props.attemptDetails.test}
                                totalMarks={props.attemptDetails.test.totalMarks}
                                obtainedMarks={getTestTotalMarks()}
                            />
                        </Col>
                        {
                            props.attemptDetails.objectiveAttempt.map(
                                (answer, index) => (
                                    <Col
                                        lg={12}
                                        key={`objective-question-${index + 1}`}>
                                        <Question
                                            question={props.attemptDetails.test.questions.find(q => q._questionId === answer.questionId)}
                                            answer={answer}
                                            number={index + 1}
                                        />
                                    </Col>
                                )
                            )
                        }
                        {
                            props.attemptDetails.subjectiveAttempt.map(
                                (answer, index) => (
                                    <Col
                                        lg={12}
                                        key={`subjective-question-${index + 1}`}>
                                        <Question
                                            question={props.attemptDetails.test.questions.find(q => q._questionId === answer.questionId)}
                                            answer={answer}
                                            number={index + 1}
                                        />
                                    </Col>
                                )
                            )
                        }
                    </Row>
                }
            </UILoader>
        </Fragment>);
};

const mapStateToProps = (state) => {
    const {
        attemptDetails,
        attemptDetailsLoading,
        attemptDetailsError,
    } = state.Tests;
    return {

        attemptDetails,
        attemptDetailsLoading,
        attemptDetailsError,
    };
}

const mapDispatchToProps = {
    getTestAttemptDetails
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AttemptDetails))


