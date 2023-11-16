import React from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import StudentProfile from './StudentProfile';
import StudentTests from '../tests/StudentTests';
import { Fragment } from 'react';
import { ArrowLeft } from 'react-feather'
import StudentAssignments from '../assignments/StudentAssignments';
import { useTranslation } from 'react-i18next';

const StudentHome = (props) => {

    const { t } = useTranslation()
    const studentId = props.match.params.studentId;

    const onSelectTest = (test) => {
        props.history.push({
            pathname: `/attempts/${test.testId}`,
            state: { studentId: studentId }
        })
    }

    const onSelectAssignment = (assignment) => {
        props.history.push({
            pathname: `/assignment-attempts/${assignment.assignmentId}`,
            state: { studentId: studentId }
        })
    }

    return (
        <Fragment>
            <div className="mb-2">
                <Button.Ripple className="btn-icon mr-2" size="sm" onClick={() => props.history.goBack()}><ArrowLeft size={16} /></Button.Ripple>
                <h4 className="d-inline m-0">{t('Student Profile')}</h4>
            </div>
            <Row>
                <Col lg={12}>
                    <StudentProfile studentId={studentId} />
                </Col>
                <Col lg={12}>
                    <StudentTests studentId={studentId} onSelect={onSelectTest} />
                </Col>
                <Col lg={12}>
                    <StudentAssignments studentId={studentId} onSelectAssignment={onSelectAssignment} />
                </Col>
            </Row>
        </Fragment>
    );
};


const mapStateToProps = (state) => {
    const { students,
        studentsError,
        studentsLoading } = state.Students;
    return {
        students,
        studentsError,
        studentsLoading
    };
};

export default withRouter(
    connect(mapStateToProps, {})(StudentHome)
)

