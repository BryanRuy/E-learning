import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { getTeacherAssignments } from '@store/actions'
import AssignmentList from './AssignmentList'
import { setContext } from '@redux-saga/core/effects'

export const TeacherAssignments = (props) => {

    const { teacherAssignmentsLoading, teacherAssignments } = props
    const [teacherAssignmentsData, setTeacherAssignmentsData, teacherAssignmentsList] = useState()
    const [currentPage, setCurrentPage] = useState(1)

    const fetchTeacherAssignment = () => {
        let data = {
            "page": currentPage,
            "limit": 20
        }
        props.getTeacherAssignments(data);
    }

    const onSelectAssignment = (assignment) => {
        props.history.push({
            pathname: `/assignments/${assignment.assignmentId}`,
            state: { assignment: assignment }
        })
    }

    const addNewAssignment = () => {
        props.history.push({
            pathname: `add-new-assignment`
        })
    }

    const onEditAssignment = (assignment) => {
        // props.history.push({
        //     pathname: `/edit-test/${test.testId}`,
        //     state: { test: test }
        // })
    }

    const onPageChange = (page) => {
        let data = {
            "page": page,
            "limit": 20
        }
        if (teacherAssignmentsList[page]) setTeacherAssignmentsData(teacherAssignmentsList[page])
        else { props.getTeacherAssignments(data); }
    }


    useEffect(() => {
        fetchTeacherAssignment();
    }, [])

    useEffect(() => {
        setTeacherAssignmentsData(teacherAssignments.data)
    }, [teacherAssignments])


    return (
        <div>
            {
                teacherAssignmentsData &&
                <AssignmentList
                    assignments={teacherAssignmentsData}
                    count={teacherAssignments.count}
                    isTeacher={true}
                    limit={20}
                    fetchAssignments={fetchTeacherAssignment}
                    onSelect={onSelectAssignment}
                    onNewAssignment={addNewAssignment}
                    onEditAssignment={onEditAssignment}
                    onPageChange={onPageChange}
                    isReloading={teacherAssignmentsLoading}
                    onBack={props.onBack} />
            }
        </div>
    )
}

TeacherAssignments.propTypes = {
    onSelect: PropTypes.func,
    onBack: PropTypes.func
}


const mapStateToProps = (state) => {
    const { teacherAssignments,
        teacherAssignmentsList,
        teacherAssignmentsLoading,
        teacherAssignmentsError } = state.Assignments;
    return {
        teacherAssignmentsList,
        teacherAssignments,
        teacherAssignmentsLoading,
        teacherAssignmentsError
    };
}

const mapDispatchToProps = {
    getTeacherAssignments
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherAssignments))
