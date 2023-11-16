import React from 'react';
import { useEffect } from 'react';
import {
    CardBody,
    CardTitle,
    Table,
    Badge,
    Button
} from 'reactstrap';
import { MoreVertical, Edit, FileText } from 'react-feather'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import CardReload from '../../@core/components/card-reload';
import Avatar from '@components/avatar'
import { titleCase } from '@utils';
import { DateTime } from '../../components/date-time';
import { useState } from 'react';
import { getAllStudents } from '@store/actions';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfileImageUrl } from '../../helpers/url_helper'
import StudentListModal from '../tests/StudentListModal';
import TestDurationModal from '../tests/TestDurationModal';
import { mergeDateTime } from '../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';

const PastAndUpcomingTestStudentList = (props) => {
    const {
        isUpcoming,
        onAssignTest,
        onUnassignTest,
        studentTests,
        fetchStudents,
        isReloading,
        students
    } = props


    const {t} = useTranslation()
    const [studentModalState, setStudentModalState] = useState(false)
    const [testModalState, setTestModalState] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const fetchAllStudents = () => {
        props.getAllStudents({limit:1000, page:1});
    }

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const getStudentStatusColor = (studentStatus) => {
        switch (studentStatus) {
            case 'active': return 'light-success';
            case 'blocked': return 'light-danger';
            case 'waiting-for-teacher': return 'light-warning';
            case 'new': return 'light-warning';
            default: return 'light-warning'
        }
    }

    const selectedStudentAssign = (student) => {
        setSelectedStudent(student)
        setStudentModalState(!studentModalState)
        setTestModalState(!testModalState)
    }

    const setTestDuration = (data) => {
        setTestModalState(!testModalState)
        let testData = {
            startTime: mergeDateTime(data.startDate, data.startTime),
            endTime: mergeDateTime(data.endDate, data.endTime),
            student: selectedStudent
        }
        if (props.onAssignTest)
            onAssignTest(testData)
    }

    const UnassignTest = (e, student) => {
        e.preventDefault()
        if (props.onUnassignTest)
            onUnassignTest(student.studentTestId)
    }

    const toggleStudentModalState = () => {
        setStudentModalState(!studentModalState)
    }

    const toggleTestModalState = () => {
        setTestModalState(!testModalState)
    }

    return (

        <CardReload
            className="past-and-upcoming-test-student"
            title={t('Students')}
            onReload={fetchStudents}
            isReloading={isReloading}>
            {
                isUpcoming &&
                <Button.Ripple className='btn-header' size="sm" color='primary' onClick={() => toggleStudentModalState()} >
                    <span className='align-middle ml-25'>{t('Schedule Test')}</span>
                </Button.Ripple>
            }
            <CardBody className="p-0">
                <Table responsive hover >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('Name')}</th>
                            <th>{t('Start time')}</th>
                            <th>{t('End time')}</th>
                            <th>{t('Status')}</th>
                            {
                                isUpcoming &&
                                <th>{t('Action')}</th>
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {studentTests && studentTests.map((s, i) =>
                            <tr key={s.studentTestId} >
                                <td>{i + 1}</td>
                                <td >
                                    <Avatar
                                        className='cursor-pointer'
                                        img={getProfileImageUrl(s.user.user.profilePicture)}
                                    />
                                    <span className='align-middle font-weight-bold ml-1'>
                                        {s.user.user.name}
                                    </span>
                                </td>
                                <td><DateTime dateTime={s.startTime} type="datetime" /></td>
                                <td><DateTime dateTime={s.endTime} type="datetime" /></td>
                                <td>
                                    <Badge
                                        pill
                                        color={getStudentStatusColor(s.user.status)}
                                        className='mr-1'>
                                        {titleCase(s.user.status)}
                                    </Badge>
                                </td>
                                {
                                    isUpcoming &&
                                    <td>
                                        <div className='d-flex'>
                                            <UncontrolledDropdown>
                                                <DropdownToggle className='pr-1' tag='span'>
                                                    <MoreVertical size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem tag='a' href='/' className='w-100' onClick={e => UnassignTest(e, s)}>
                                                        <FileText size={15} />
                                                        <span className='align-middle ml-50'>{t('Unassign')}</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </td>
                                }
                            </tr>
                        )}
                    </tbody>
                </Table>
                {
                    studentModalState &&
                    <StudentListModal
                        students={students.data}
                        isOpen={studentModalState}
                        onSelectedStudent={selectedStudentAssign}
                        toggleModalState={toggleStudentModalState} />
                }

                {
                    testModalState &&
                    <TestDurationModal
                        isOpen={testModalState}
                        setTestDuration={setTestDuration}
                        toggleModalState={toggleTestModalState} />
                }
            </CardBody >
        </CardReload >
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

const mapDispatchToProps = {
    getAllStudents
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PastAndUpcomingTestStudentList)
)
