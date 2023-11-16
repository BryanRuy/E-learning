import React from 'react';

import {
    Row,
    Col
} from 'reactstrap';


import { connect } from 'react-redux'
import { useEffect } from 'react';
import { getTestAttempts } from '@store/actions';
import { withRouter } from 'react-router-dom';
import TestDetail from '../tests/TestDetail';
import AttemptList from './AttemptList';

const Attempts = (props) => {

    const testId = props.match.params.testId;
    const studentId = props.studentId || props.location.state.studentId;
    const { attempts } = props;

    const getAttempts = () => {
        props.getTestAttempts({ studentId, testId })
    }

    useEffect(getAttempts, []);

    const onSelectAttempt = (attempt) => {
        props.history.push({
            pathname: `/attempt-detail/${attempt.attemptId}`,
            state: { testId: testId }
        })
    }

    return (
        <>
            {Object.keys(attempts).length > 0 && (
                <Row>
                    <Col lg={12}>
                        <TestDetail test={attempts[0].test} />
                    </Col>
                    <Col lg={12}>
                        <AttemptList attempts={attempts} onSelect={onSelectAttempt} />
                    </Col>
                </Row>
            )

            }
        </>
    );
};

const mapStateToProps = (state) => {
    const { attempts,
        attemptsLoading,
        attemptsError } = state.Attempts;
    return {
        attempts,
        attemptsLoading,
        attemptsError
    };
}

const mapDispatchToProps = {
    getTestAttempts
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Attempts))


