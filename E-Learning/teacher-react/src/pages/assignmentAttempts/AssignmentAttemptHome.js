import React from 'react';

import {
    Row,
    Col,
} from 'reactstrap';


import { connect } from 'react-redux'
import { useEffect } from 'react';
import { getAssignmentAttempts } from '@store/actions';
import { withRouter } from 'react-router-dom';
import AssignmentDetail from '../assignments/AssignmentDetail';
import AssignmentAttemptList from './AssignmentAttemptList';

const AssignmentAttempts = (props) => {

    const assignmentId = props.match.params.assignmentId;
    const studentId = props.studentId || props.location.state.studentId;
    const { assignmentAttempts } = props;

    const getAttempts = () => {
        props.getAssignmentAttempts({ studentId, assignmentId })
    }

    useEffect(getAttempts, []);

    const onSelectAttempt = (assignmentAttempts) => {
        props.history.push({
            pathname: `/assignment-attempt-detail/${assignmentAttempts.assignmentAttemptId}`,
            state: { assignmentId: assignmentId }
        })
    }

    return (
        <>
            {Object.keys(assignmentAttempts).length > 0 && (
                <Row>
                    <Col lg={12}>
                        <AssignmentDetail assignment={assignmentAttempts[0].assignment} />
                    </Col>
                    <Col lg={12}>
                        <AssignmentAttemptList assignmentAttempts={assignmentAttempts} onSelect={onSelectAttempt} />
                    </Col>
                </Row>
            )

            }
        </>
    );
};

const mapStateToProps = (state) => {
    const { assignmentAttempts,
        assignmentAttemptsLoading,
        assignmentAttemptsError } = state.AssignmentAttempts;
    return {
        assignmentAttempts,
        assignmentAttemptsLoading,
        assignmentAttemptsError,
    };
}

const mapDispatchToProps = {
    getAssignmentAttempts
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssignmentAttempts))


