import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TestList from './TestList'
import { withRouter } from 'react-router-dom'
import { useEffect,useState } from 'react'
import { getTeacherTests } from '@store/actions'

export const TeacherTests = (props) => {

    const { teacherTestsLoading } = props
    const [currentPage, setCurrentPage] = useState(1)
    const [teacherTestsData, setTeacherTestsData] = useState()

    const fetchTeacherTests = () => {
        let data= {"page":currentPage, limit:20}
        props.getTeacherTests(data);
    }

    const onSelectTest = (test) => {
        props.history.push({
            pathname: `/tests/${test.testId}`,
            state: { test: test }
        })
    }

    const addNewTest = () => {
        props.history.push({
            pathname: `add-new-test`
        })
    }

    const onEditTest = (test) => {
        props.history.push({
            pathname: `/edit-test/${test.testId}`,
            state: { test: test }
        })
    }

    const onPageChange = (page) => {
        setCurrentPage(page)
        let data= {"page":page, limit:20}
        if(props.teacherTestList[page]) setTeacherTestsData(props.teacherTestList[page])
        else props.getTeacherTests(data);
    }

    useEffect(() => {
        fetchTeacherTests();
    }, [])

    useEffect(() => {
        setTeacherTestsData(props.teacherTests.data)
    }, [props.teacherTests])

    return (
        <div>
            {
            teacherTestsData &&
            <TestList
                count={props.teacherTests.count}
                tests={teacherTestsData}
                isTeacher={true}
                limit={20}
                fetchTests={fetchTeacherTests}
                onSelect={onSelectTest}
                onNewTest={addNewTest}
                onEditTest={onEditTest}
                onPageChange={onPageChange}
                isReloading={teacherTestsLoading}
                onBack={props.onBack} />
            }
        </div>
    )
}

TeacherTests.propTypes = {
    onSelect: PropTypes.func,
    onBack: PropTypes.func
}


const mapStateToProps = (state) => {
    const { teacherTests, teacherTestList, teacherTestsLoading, teacherTestsError } = state.Tests;
    return { teacherTests,teacherTestList, teacherTestsLoading, teacherTestsError };
}

const mapDispatchToProps = {
    getTeacherTests
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherTests))
