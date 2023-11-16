import React from 'react';
import {
    CardBody,
    Table
} from 'reactstrap';
import { DateTime } from '../../components/date-time';
import PropTypes from 'prop-types';
import CardReload from '../../@core/components/card-reload';
import { Button } from 'reactstrap'

import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router';
import { connect } from 'react-redux';


const HistoryList = (props) => {

    const { users, isTeacher, fetchHistory, isReloading } = props;
    const { t } = useTranslation()

    const goToTeacherProfile = (teacher) => {
        props.history.push({
            pathname:`/teacher-history/${teacher.userId}`,
            state:{user:teacher}
        })
    }

    const goToStudentProfile = (student) => {
        props.history.push({
            pathname:`/student-history/${student.userId}`,
            state:{user:student}
        })
    }

   


    return (
        <CardReload className="p-0"
            title={`${isTeacher ? `${t('Students')}` : `${t('Teachers')}`} history`}
            onReload={fetchHistory}
            isReloading={isReloading}>
            <CardBody>
                <Table responsive hover >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('Name')}</th>
                            <th>{t('Assigned On')}</th>
                            <th>{t('Action')}</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users && users.map((u, i) => {
                                let studentName = "";
                                let teacherName = "";
                                let studentId = "";
                                let teacherId = "";
                                
                                if (u && u.student && u.student.user) {
                                    studentName = u.student.user.name
                                    studentId = u.student.user.userId
                                    console.log(u.student)
                                }

                                if (u && u.teacher && u.teacher.user) {
                                    teacherName = u.teacher.user.name
                                    teacherId = u.teacher.user.userId
                                    console.log(u.teacher)
                                }

                                return (
                                    <tr key={i + 1} >
                                        <td>{i + 1}</td>
                                        <td>
                                            <span className='align-middle font-weight-bold'>
                                                {isTeacher ? studentName : teacherName}
                                            </span>
                                        </td>
                                        <td><DateTime dateTime={u.createdAt} type="dateTime" /></td>
                                        <td>
                                            <Button.Ripple color='flat-primary'
                                                onClick={() => {
                                                    if (isTeacher)
                                                        goToStudentProfile(u.student.user)
                                                    else
                                                        goToTeacherProfile(u.teacher.user)

                                                }}>
                                                <span className='align-middle'>{t('View')}</span>
                                            </Button.Ripple>
                                        </td>

                                    </tr>
                                )
                            })

                        }
                    </tbody>
                </Table>
            </CardBody>
        </CardReload>
    );
};


HistoryList.propTypes = {
    users: PropTypes.array.isRequired,
    onBack: PropTypes.func
}


export default withRouter(HistoryList)



