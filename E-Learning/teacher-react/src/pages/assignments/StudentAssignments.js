import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getStudentAssignments } from '@store/actions'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import AssignmentList from './AssignmentList'

const StudentAssignments = (props) => {

    const [mapAssignments, setMapAssignments] = useState([])
    const [studentAssignmentData, setStudentAssignmentData] = useState([])
    const { studentId, studentAssignments, studentAssignmentsLoading ,studentAssignmentList} = props;
    const [currentPage, setCurrentPage] = useState(1)

    const fetchStudentAssignments = () => {
        let data ={
            "studentId":studentId,
            "page":currentPage,
            "limit":5
        }
        props.getStudentAssignments(data)
    }

    const onSelectAssignment = (assignment) => {
        if (props.onSelectAssignment) {
            props.onSelectAssignment(assignment);
        }
    }

    const onPageChange = (page) => {
        let data ={
            "studentId":studentId,
            "page":page,
            "limit":5
        }
        if(studentAssignmentList[page]) setStudentAssignmentData(studentAssignmentList[page])
        else props.getStudentAssignments(data)
    }
   

    const filteredAssignmentsData = () => {
        console.log("filteredAssignmentsData" ,studentAssignmentData);
        if(studentAssignmentData){
            let assignmentMap = new Map();
            for (let a of studentAssignmentData) {
                if (a.assignment && !assignmentMap.has(a.assignment.assignmentId)) {
                    assignmentMap.set(a.assignment.assignmentId, a.assignment);
                }
            }
            setMapAssignments(Array.from(assignmentMap.values()));
        } else {
            setMapAssignments([])
        }
    }

    const setAssignmentList = () =>{
        setStudentAssignmentData(studentAssignments.data)
    }

    useEffect(fetchStudentAssignments, [])
    useEffect(setAssignmentList, [studentAssignments])
    useEffect(filteredAssignmentsData, [studentAssignmentData])

    return (
        <>
            {
                studentAssignments &&
                mapAssignments &&
                mapAssignments.length > 0 &&
                <AssignmentList
                    assignments={mapAssignments}
                    count={studentAssignments.count}
                    limit={5}
                    isTeacher={false}
                    fetchAssignments={fetchStudentAssignments}
                    onSelect={onSelectAssignment}
                    onPageChange={onPageChange}
                    isReloading={studentAssignmentsLoading}
                    onBack={props.onBack} />
            }
        </>
    )
}

StudentAssignments.propTypes = {
    studentId: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    onBack: PropTypes.func
}

const mapStateToProps = (state) => {

    const { 
        studentAssignmentList,
        studentAssignments,
        studentAssignmentsLoading,
        studentAssignmentsError } = state.Assignments;
    return {
        studentAssignmentList,
        studentAssignments,
        studentAssignmentsLoading,
        studentAssignmentsError
    };
}

const mapDispatchToProps = {
    getStudentAssignments
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentAssignments))
