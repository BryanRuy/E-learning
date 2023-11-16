import React, { useEffect, useState } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col, Button, Table, Label, Input
} from 'reactstrap'



// ** Store & Actions
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import {
    getTeachersStats, getAllTeachers, onSearchTeacherChange
} from './store/actions'

import { RefreshCcw } from 'react-feather'


import { DateTime } from '../../components/date-time';
import UILoader from '../../@core/components/ui-loader';

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { StatsItemCard } from '../../views/stats-item-card'
import { useTranslation } from 'react-i18next'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'
import CustomPagination from '../pagination';

const Teachers = (props) => {

    const [searchValue, setSearchValue] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(0)
    const { t } = useTranslation();
    const { teachersStats, teacherListData, allTeachers,
        allTeachersLoading, allTeachersError, } = props
    const [teachersList, setTeachersList] = useState([])

    const handleViewTeacher = (teacher) => {
        props.history.push({
            pathname:`/teacher-history/${teacher.userId}`,
            state:{user:teacher}
        })
    }

    const onSelect = (student) => {
        props.history.push({
            pathname: `/assign-unassign-teacher`,
            state: { user: student, isTeacher: false }
        })
    }

    useEffect(() => {
        if (allTeachers && allTeachers.data) setTeachersList(allTeachers.data)
        if (allTeachers && allTeachers.count) setPagesCount(allTeachers.count)
    }, [allTeachers])


    useEffect(() => {
        props.getTeachersStats({ page: 1, limit: 20 })
        fetchTeacherList(0)
    }, [])

    useEffect(() => {
        props.onSearchTeacherChange()
    }, [searchValue])

    const onSelectPage = (page) => {
        if (teacherListData[page]) setTeachersList(teacherListData[page])
        else { fetchTeacherList(page) }
    }

    const searchTeacherByName = () => {
        fetchTeacherList(1)
    }

    const fetchTeacherList = (page) => {
        props.getAllTeachers({ page: page, limit: 20, search: searchValue })
    }

    return (
        <Fragment >
            <UILoader
                blocking={props.teachersLoading}
            >
                <Card>
                    <CardBody >
                        <Row className="d-flex align-items-center">
                            <Col sm='6'>
                                <h4 className="m-0">
                                    {t('Teachers')}
                                </h4>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Teachers')} January`}
                                    value={teachersStats.thisMonthCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Teachers')} 2021`}
                                    value={teachersStats.thisYearCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Teachers')} ${t('All')}`}
                                    value={teachersStats.allTimeCount}
                                />
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <StatsItemCard
                                    label={`${t('Teachers')} ${t('Active')}`}
                                    value={teachersStats.activeCount}
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
                                <Button.Ripple className="btn-icon ml-1" size="sm" onClick={searchTeacherByName}><RefreshCcw size={14} /></Button.Ripple>
                            </Col>
                        </Row>

                        <div className="shadow-stats-item mt-3">
                            {
                                !props.teachersLoading &&
                                props.teachersError &&
                                <NoNetwork message={props.teachersError} />
                            }
                            {
                                !props.teachersLoading &&
                                !props.teachersError &&
                                teachersList.length == 0 &&
                                <NotFound message={t("No teacher found")} />
                            }
                            {
                                !props.teachersLoading &&
                                !props.teachersError &&
                                teachersList.length > 0 &&


                                <Table responsive hover >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>{t('Name')}</th>
                                            <th>{t('Email')}</th>
                                            <th>{t('DATE/TIME')}</th>
                                            <th>{t('Action')}</th>
                                            <th>{t('Unassign')}</th>
                                            <th>{t('Expiry')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            teachersList.map((teacher, i) =>
                                                <tr key={"assignment-" + i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span className='align-middle font-weight-bold'>
                                                            {teacher.name}
                                                        </span>
                                                    </td>
                                                    <td>{teacher.email}</td>
                                                    <td><DateTime dateTime={teacher.createdAt} type="dateTime" /></td>
                                                    <td><Button color="flat-primary" onClick={() => handleViewTeacher(teacher)}>{t('View')}</Button></td>
                                                    <td><Button color="flat-primary" onClick={() => onSelect(teacher)}>{t('Unassign')}</Button></td>
                                                    <td>{teacher.paymentPlan ? teacher.paymentPlan.endDate : 'N/A'}</td>
                                                </tr>
                                            )}
                                    </tbody>
                                </Table>
                            }
                            {
                                teachersStats.teachers && teachersStats.teachers.pages &&
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
        teachersStats,
        teachersError,
        teachersLoading,

        allTeachers,
        allTeachersLoading,
        allTeachersError,

        teacherListData
    } = state.Teachers

    return {
        teachersStats,
        teachersError,
        teachersLoading,

        teacherListData,
        allTeachers,
        allTeachersLoading,
        allTeachersError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getTeachersStats, getAllTeachers ,onSearchTeacherChange
    })(Teachers)
)
