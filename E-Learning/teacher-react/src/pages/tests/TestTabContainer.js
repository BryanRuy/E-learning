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
    assignTest,
    unassignTest,
    getPastStudent,
    getUpcomingStudent,
} from '@store/actions'
import PastAndUpcomingTestStudentList from './PastAndUpcomingTestStudentList';
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';


const TestsTabContainer = (props) => {

    const { t } = useTranslation()
    const [active, setActive] = useState('1')

    const [isLoading, setIsLoading] = useState(false)

    const { test, pastStudents, pastStudentsLoading,
        upcomingStudents, upcomingStudentsLoading,
        assignTestLoading, assignTestError, assignTestSuccess,
        unassignTestLoading, unassignTestError, unassignTestSuccess } = props

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const fetchStudents = () => {
        props.getPastStudent(test.testId);
        props.getUpcomingStudent(test.testId);
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        setIsLoading(assignTestLoading)
    }, [assignTestLoading]);

    useEffect(() => {
        setIsLoading(unassignTestLoading)
    }, [unassignTestLoading]);

    useEffect(() => {
        if (assignTestError) errorAlertDialog(assignTestError);
        if (assignTestSuccess) successAlertDialog(t('Test has been assigned successfully'));
        fetchStudents()
    }, [assignTestError, assignTestSuccess]);

    useEffect(() => {
        if (props.unassignTestError) errorAlertDialog(props.unassignTestError, 'error');
        if (props.unassignTestSuccess) successAlertDialog(t('Test has been unassigned successfully'));
        fetchStudents()
    }, [unassignTestError, unassignTestSuccess]);



    const assignTest = (testData) => {
        let data = {
            studentId: testData.student.user.userId,
            startTime: testData.startTime,
            endTime: testData.endTime,
            testId: test.testId
        }
        props.assignTest(data)
    }

    const unAssignTest = (studentTestId) => {
        let data = {
            studentTestId: studentTestId,
            testId: test.testId
        }
        props.unassignTest(data)
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
                                    {t('Past Tests')}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                        toggle('2')
                                    }}
                                >
                                    {t('Upcoming Tests')}
                                </NavLink>
                            </NavItem>

                        </Nav>

                        <TabContent className='py-50' activeTab={active}>
                            <TabPane tabId='1'>
                                <PastAndUpcomingTestStudentList
                                    studentTests={pastStudents}
                                    isUpcoming={false}
                                    fetchStudents={fetchStudents}
                                    isReloading={pastStudentsLoading}
                                />
                            </TabPane>

                            <TabPane tabId='2'>
                                <PastAndUpcomingTestStudentList
                                    studentTests={upcomingStudents}
                                    isUpcoming={true}
                                    fetchStudents={fetchStudents}
                                    onAssignTest={assignTest}
                                    onUnassignTest={unAssignTest}
                                    isReloading={upcomingStudentsLoading}
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

        assignTest, assignTestLoading,
        assignTestError, assignTestSuccess,
        pastStudents, pastStudentsLoading, pastStudentsError,
        upcomingStudents, upcomingStudentsLoading, upcomingStudentsError,
        unassignTestLoading, unassignTestError, unassignTestSuccess,
    } = state.Tests
    return {
        assignTest, assignTestLoading,
        assignTestError, assignTestSuccess,
        pastStudents, pastStudentsLoading, pastStudentsError,
        upcomingStudents, upcomingStudentsLoading, upcomingStudentsError,
    }

}

const mapDispatchToProps = {
    unassignTest,
    assignTest,
    getPastStudent,
    getUpcomingStudent
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(TestsTabContainer)
)