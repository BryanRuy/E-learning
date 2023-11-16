import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TestList from './TestList'
import { getStudentTests } from '@store/actions'

import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

export const StudentTests = (props) => {

    const [mapTests, setMapTests] = useState()
    const [studentTestsData, setStudentTestsData] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const { studentId,  studentTestsLoading } = props;

    const fetchStudentTests = () => {
        let data = {
            "studentId": studentId,
            page: currentPage,
            limit: 5
        }
        props.getStudentTests(data)
    }

    const onSelectTest = (test) => {
        if (props.onSelect) {
            props.onSelect(test);
        }
    }

    useEffect(fetchStudentTests, [])

    const filteredTestsData = () => {
        if (studentTestsData) {
            let testMap = new Map();
            for (let t of studentTestsData) {
                if (t.test && !testMap.has(t.test.testId)) {
                    testMap.set(t.test.testId, t.test);
                }
            }
            setMapTests(Array.from(testMap.values()));
        }
    }

    const onPageChange = (page) => {
        let data = {
            "studentId": studentId,
            page: page,
            limit: 5
        }
        if (props.studentTestList[page]) setStudentTestsData(props.studentTestList[page])
        else props.getStudentTests(data)
    }

    const setTestListData = () => {
        setStudentTestsData(props.studentTests.data)
    }

    useEffect(setTestListData, [props.studentTests])
    useEffect(filteredTestsData, [studentTestsData])

    return (
        <>
            {
                mapTests && 
                Object.keys(mapTests).length > 0 &&
                <TestList 
                    tests={mapTests}
                    fetchTests={fetchStudentTests}
                    count={props.studentTests.count}
                    isTeacher={false}
                    limit = {5}
                    onSelect={onSelectTest}
                    onPageChange={onPageChange}
                    isReloading={studentTestsLoading}
                    onBack={props.onBack} />
            }
        </>
    )
}

StudentTests.propTypes = {
    studentId: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    onBack: PropTypes.func
}

const mapStateToProps = (state) => {
    const { studentTests, studentTestList, studentTestsLoading, studentTestsError } = state.Tests;
    return { studentTests, studentTestList, studentTestsLoading, studentTestsError };
}

const mapDispatchToProps = {
    getStudentTests
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentTests))
