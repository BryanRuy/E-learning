import React from 'react';
import {
    Row,
    Col,
} from 'reactstrap';
import AssignmentDetail from './AssignmentDetail';
import AssignmentsTabContainer from './AssignmentsTabContainer';

const AssignAssignmentHome = (props) => {

    const { assignment } = props.location.state;

    return (
        <>
            {
                Object.keys(assignment).length > 0 && (
                    <Row>
                        <Col lg={12}>
                            <AssignmentDetail assignment={assignment} />
                        </Col>

                        <Col lg={12}>
                            <AssignmentsTabContainer assignment={assignment} />
                        </Col>
                    </Row>
                )
            }
        </>
    );
};


export default AssignAssignmentHome


