import React, { useEffect, useState } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col, Label, Input, Button
} from 'reactstrap'

import { RefreshCcw } from 'react-feather';
// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
    getStudentsStats,  onSearchChange,getActiveStudents
} from './store/actions'

import { useTranslation } from 'react-i18next'
import UILoader from '../../@core/components/ui-loader';

import { StatsItemCard } from '../../views/stats-item-card'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import StudentList from './student-list';
import CustomPagination from '../pagination';

const ActiveStudents = (props) => {

    const { studentListData, studentStats,
        studentStatsError, studentStatsLoading,
        activeStudents, activeStudentsLoading,activeStudentsError,
       } = props

    const [searchValue, setSearchValue] = useState()
    const [studentList, setStudentList] = useState([])
    const [pagesCount, setPagesCount] = useState(0)

    const { t } = useTranslation()
    useEffect(() => {
        props.getStudentsStats()
    }, [])

    useEffect(() => {
        if (studentStats && studentStats.students && studentStats.students.data) setStudentList(studentStats.students.data)
    }, [studentStats])

    useEffect(() => {
        if (activeStudents && activeStudents.data) setStudentList(activeStudents.data)
        if (activeStudents && activeStudents.pages) setPagesCount(activeStudents.count)
    }, [activeStudents])

    useEffect(() => {
        props.onSearchChange()
    }, [searchValue])

    const onSelect = (student) => {
        props.history.push({
            pathname: `/assign-unassign-teacher`,
            state: { user: student, isTeacher: true }
        })
    }

    const handleViewStudent = (student) => {
        props.history.push({
            pathname:`/student-history/${student.userId}`,
            state:{user:student}
        })
    }

    const onSelectPage = (page) => {
        if (studentListData[page]) setStudentList(studentListData[page])
        else { fetchStudentList(page) }
    }

    const searchStudentByName = () => {
        fetchStudentList(1)
    }

    const fetchStudentList = (page) => {
        let data = { page: page, limit: 20, search: searchValue }
        props.getActiveStudents(data)
    }


    return (
        <Fragment >
            <UILoader
                blocking={props.allStudentsLoading || props.studentStatsLoading}
            >
                <Card>
                    <CardBody >
                        <Row className="d-flex align-items-center">
                            <Col sm='6'>
                                <h4 className="m-0">
                                    {t("Students")}
                                </h4>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Students')} January`}
                                    value={studentStats.thisMonthCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Students')} 2021`}
                                    value={studentStats.thisYearCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Students')} ${t('All')}`}
                                    value={studentStats.allTimeCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Students')} ${t('Active')}`}
                                    value={studentStats.activeCount}
                                />
                            </Col>
                        </Row>

                        <Row className=' mx-0 mt-1 mb-50'>
                            <Col className=' d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='12'>
                                <Label className='mr-1' for='search-input'>
                                    {t('Search')}
                                </Label>
                                <Input
                                    className='dataTable-filter'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input'
                                    value={searchValue}
                                    onChange={e => { setSearchValue(e.target.value) }}
                                />
                                <Button.Ripple className="btn-icon ml-1" size="sm" onClick={searchStudentByName}><RefreshCcw size={14} /></Button.Ripple>
                            </Col>
                        </Row>

                        <div className="shadow-stats-item mt-3">
                            {
                                !studentStatsLoading &&
                                studentStatsError &&
                                <NoNetwork message={studentStatsError} />
                            }

                            {
                                !studentStatsLoading &&
                                !studentStatsError &&
                                studentStats.students &&
                                studentStats.students.data &&
                                studentStats.students.data.length == 0 &&
                                <NotFound message={t("No student found")} />
                            }

                            {
                                !studentStatsLoading &&
                                !studentStatsError &&
                                studentList.length > 0 &&

                                <StudentList
                                    isNew={false}
                                    dataList={studentList}
                                    handleViewStudent={handleViewStudent}
                                    onSelect={onSelect}
                                    isActiveStudent={true}
                                />
                            }
                            {
                                studentList.length > 0 &&
                                <CustomPagination pages={Math.ceil(pagesCount / 20)} onSelect={onSelectPage} />
                            }


                        </div>
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        studentListData,
        studentStats,
        studentStatsError,
        studentStatsLoading,

        activeStudents,
        activeStudentsLoading,
        activeStudentsError,

    } = state.Students

    return {
        studentListData,
        studentStats,
        studentStatsError,
        studentStatsLoading,

        activeStudents,
        activeStudentsLoading,
        activeStudentsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getStudentsStats,
        onSearchChange,
        getActiveStudents
    })(ActiveStudents)
)
