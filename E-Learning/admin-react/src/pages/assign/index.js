

import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Card } from 'reactstrap';
import UILoader from '../../@core/components/ui-loader';
import { getAllTeachers, postAssignTeacher, getTeacherStudents, unassignTeacher } from '@store/actions'
import UsersList from './users-list'
import UserInfo from './user-info'
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import { useTranslation } from 'react-i18next'

const assignTeacher = (props) => {

    const { t } = useTranslation()
    const { user, isTeacher } = props.history.location.state

    const [selectedUser, setSelectedUser] = useState(user)
    const { allTeachers, allTeachersError, allTeachersLoading,
        teacherStudents, teacherStudentsError, teacherStudentsLoading,
        unassignTeacher, unassignTeacherSuccess, unassignTeacherError, unassignTeacherLoading,
        assignTeacher, assignTeacherSuccess, assignTeacherError, assignTeacherLoading, teacherListData } = props

    const [listData, setlistData] = useState([])
    const [pagesCount, setPagesCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(unassignTeacherLoading)
    }, [props.unassignTeacherLoading])

    useEffect(() => {
        setIsLoading(assignTeacherLoading)
    }, [props.assignTeacherLoading])

    useEffect(() => {
        if (props.assignTeacherSuccess)
            successAlertDialog(t('Teacher assigned successfully'))
        fetchData()
    }, [props.assignTeacherSuccess])

    useEffect(() => {
        if (props.assignTeacheError)
            errorAlertDialog(assignTeacherError)
    }, [props.assignTeacherError])

    useEffect(() => {
        if (props.unassignTeacherSuccess)
            successAlertDialog(t('Teacher unassigned successfully'))
        fetchData()
    }, [props.unassignTeacherSuccess])

    useEffect(() => {
        if (props.unassignTeacherError)
            errorAlertDialog(unassignTeacherError)
    }, [props.unassignTeacherError])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (name) => {
        if (isTeacher) {
            let params = { limit: 20, page: 1, search: name }
            props.getAllTeachers(params)
        } else {
            props.getTeacherStudents(user.userId)
        }
    }

    const onAssignTeacher = (teacher) => {
        let data = {
            teacherId: teacher.userId,
            studentId: user.userId
        }
        props.postAssignTeacher(data)
    }

    const onUnassignTeacher = (student) => {
        let data = {
            studentId: student.userId
        }
        props.unassignTeacher(data)
    }

    useEffect(() => {
        setlistData([])
        if (isTeacher) setPagesCount(allTeachers.count)
        if (isTeacher && allTeachers.data && allTeachers.data.length > 0) setlistData(allTeachers.data)
        else if (teacherStudents.length > 0) setlistData(teacherStudents)

    }, [allTeachers, teacherStudents])

    const onSelectPage = (page) => {
        if (teacherListData[page]) setlistData(teacherListData[page])
        else {
            let params = { limit: 20, page: page }
            props.getAllTeachers(params)
        }
    }

    return (
        <>
            <UILoader blocking={isLoading}>
                {
                    selectedUser &&
                    <Card>
                        <UserInfo user={selectedUser} />
                    </Card>
                }

                {
                    <Card>
                        <UsersList
                            listData={listData}
                            isTeacher={isTeacher}
                            fetchListData={fetchData}
                            isReloading={isTeacher ? allTeachersLoading : teacherStudentsLoading}
                            onAssignTeacher={onAssignTeacher}
                            onUnassignTeacher={onUnassignTeacher}
                            fetchData={fetchData}
                            onSelectPage={onSelectPage}
                            pagesCount={pagesCount} />
                    </Card>
                }
            </UILoader>
        </>
    )
}


const mapStateToProps = (state) => {
    const {
        allTeachers,
        allTeachersError,
        allTeachersLoading,
        teacherListData,

        teacherStudents,
        teacherStudentsLoading,
        teacherStudentsError,

    } = state.Teachers

    const {
        assignTeacher,
        assignTeacherSuccess,
        assignTeacherError,
        assignTeacherLoading,

        unassignTeacher,
        unassignTeacherSuccess,
        unassignTeacherError,
        unassignTeacherLoading,

    } = state.Assign

    return {
        allTeachers,
        allTeachersError,
        allTeachersLoading,
        teacherListData,

        teacherStudents,
        teacherStudentsLoading,
        teacherStudentsError,

        assignTeacher,
        assignTeacherSuccess,
        assignTeacherError,
        assignTeacherLoading,

        unassignTeacher,
        unassignTeacherSuccess,
        unassignTeacherError,
        unassignTeacherLoading,

    }




}

const mapDispatchToProps = {
    getAllTeachers,
    postAssignTeacher,
    getTeacherStudents,
    unassignTeacher
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(assignTeacher))