import React from 'react';

import {
    Card,
    CardBody
} from 'reactstrap';
import { useState, useEffect } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../../assets/scss/custom/components/_card.scss'
import UILoader from '../../@core/components/ui-loader';
import {
    assignAssignment,
    unassignAssignment,
    getAssignmentPastStudent,
    getAssignmentUpcomingStudent,
} from '@store/actions'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import PastAndUpcomingAssignmentStudentList from './PastAndUpcomingAssignmentStudentList';
import { useTranslation } from 'react-i18next';


const AssignmentsTabContainer = (props) => {

    const { t } = useTranslation()
    const [active, setActive] = useState('1')

    const [isLoading, setIsLoading] = useState(false)

    const { assignment, pastAssignmentStudents, pastAssignmentStudentsLoading,
        upcomingAssignmentStudents, upcomingAssignmentStudentsLoading,
        assignAssignmentLoading, assignAssignmentError, assignAssignmentSuccess,
        unassignAssignmentLoading, unassignAssignmentError, unassignAssignmentSuccess } = props

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const fetchStudents = () => {
        props.getAssignmentPastStudent(assignment.assignmentId);
        props.getAssignmentUpcomingStudent(assignment.assignmentId);
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        setIsLoading(assignAssignmentLoading)
    }, [assignAssignmentLoading]);

    useEffect(() => {
        setIsLoading(unassignAssignmentLoading)
    }, [unassignAssignmentLoading]);

    useEffect(() => {
        if (assignAssignmentSuccess) successAlertDialog(t('Assignment has been assigned successfully'));
        fetchStudents()
    }, [assignAssignmentSuccess]);

    useEffect(() => {
        if (assignAssignmentError) errorAlertDialog(assignAssignmentError);
    }, [assignAssignmentError]);

    useEffect(() => {
        if (unassignAssignmentSuccess) successAlertDialog(t('Assignment has been unassigned successfully'));
        fetchStudents()
    }, [unassignAssignmentSuccess]);

    useEffect(() => {
        if (unassignAssignmentError) errorAlertDialog(unassignAssignmentError);
    }, [unassignAssignmentError]);



    const assignAssignment = (assignmentData) => {
        let data = {
            studentId: assignmentData.student.user.userId,
            startDate: assignmentData.startTime,
            endDate: assignmentData.endTime,
            assignmentId: assignment.assignmentId
        }
        props.assignAssignment(data)
    }

    const unAssignAssignment = (studentAssignmentId) => {
        let data = {
            studentAssignmentId: studentAssignmentId,
            assignmentId: assignment.assignmentId
        }
        props.unassignAssignment(data)
    }

    return (
        <>
            <UILoader blocking={isLoading}>
                <Card>
                    <CardBody >
                        <Nav tabs fill>
                            <NavItem>
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                        toggle('1')
                                    }}
                                >
                                    {t('Past Assignments')}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                        toggle('2')
                                    }}
                                >
                                    {t('Upcoming Assignments')}
                                </NavLink>
                            </NavItem>

                        </Nav>

                        <TabContent className='py-50' activeTab={active}>
                            <TabPane tabId='1'>
                                <PastAndUpcomingAssignmentStudentList
                                    studentAssignments={pastAssignmentStudents}
                                    isUpcoming={false}
                                    fetchStudents={fetchStudents}
                                    isReloading={pastAssignmentStudentsLoading}
                                />
                            </TabPane>

                            <TabPane tabId='2'>
                                <PastAndUpcomingAssignmentStudentList
                                    studentAssignments={upcomingAssignmentStudents}
                                    isUpcoming={true}
                                    fetchStudents={fetchStudents}
                                    onAssignAssignment={assignAssignment}
                                    onUnassignAssignment={unAssignAssignment}
                                    isReloading={upcomingAssignmentStudentsLoading}
                                />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </UILoader>
        </>
    )

};



const mapStateToProps = (state) => {
    const {
        assignAssignment, assignAssignmentLoading,
        assignAssignmentError, assignAssignmentSuccess,
        pastAssignmentStudents, pastAssignmentStudentsLoading, pastAssignmentStudentsError,
        upcomingAssignmentStudents, upcomingAssignmentStudentsLoading, upcomingAssignmentStudentsError,
        unassignAssignmentLoading, unassignAssignmentError, unassignAssignmentSuccess,
    } = state.Assignments
    return {
        assignAssignment, assignAssignmentLoading,
        assignAssignmentError, assignAssignmentSuccess,
        pastAssignmentStudents, pastAssignmentStudentsLoading, pastAssignmentStudentsError,
        upcomingAssignmentStudents, upcomingAssignmentStudentsLoading, upcomingAssignmentStudentsError,
        unassignAssignmentLoading, unassignAssignmentError, unassignAssignmentSuccess,
    }

}

const mapDispatchToProps = {
    unassignAssignment,
    assignAssignment,
    getAssignmentPastStudent,
    getAssignmentUpcomingStudent
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AssignmentsTabContainer)
)