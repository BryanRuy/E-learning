import React, { useEffect } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col, Button, Table,
} from 'reactstrap'

// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
    getDashboardData
} from './store/actions'


import StatsVertical from '@components/widgets/stats/StatsVertical'
import {
    User, Users, Book, TrendingDown, TrendingUp, RefreshCcw
} from 'react-feather'

import { DateTime } from '../../components/date-time';
import UILoader from '../../@core/components/ui-loader';
import { useTranslation } from 'react-i18next'
import { StatsItemCard } from '../../views/stats-item-card'
import './style.scss'

const Dashboard = (props) => {

    const { t } = useTranslation()

    useEffect(() => {
        if (Object.keys(props.data).length == 0)
            props.getDashboardData()
    }, [])

    const handleViewTeacher = (teacher) => {
        props.history.push({
            pathname:`/teacher-history/${teacher.userId}`,
            state:{user:teacher}
        })
    }

    const handleViewStudent = (student) => {
            props.history.push({
            pathname:`/student-history/${student.userId}`,
            state:{user:student}
        })
    }


    return (
        <Fragment >
            <UILoader
                blocking={props.loading}
            >
                <Card>
                    <CardBody >
                        {
                            Object.keys(props.data).length > 0 &&
                            <>
                                <Row className="d-flex align-items-center">
                                    <Col sm='6'>
                                        <h4 className="m-0">
                                            {t('Statistics')}
                                        </h4>
                                    </Col>
                                    <Col sm='6'>
                                        <div className="text-right">
                                            <Button.Ripple
                                                color={'secondary'}
                                                className="btn btn-icon btn-sm"
                                                onClick={() => props.getDashboardData()}
                                            >
                                                <RefreshCcw size={20} />
                                            </Button.Ripple>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mt-2 d-flex justify-content-around">
                                    {/* Stats With Icons */}
                                    <Col xl='4' md='4' sm='6'>
                                        <StatsVertical
                                            className="shadow-stats-item"
                                            icon={<Users size={21} />}
                                            color='info'
                                            stats={`${props.data.studentsCount}`}
                                            statTitle={t('Students')}
                                        />
                                    </Col>
                                    <Col xl='4' md='4' sm='6'>
                                        <StatsVertical
                                            className="shadow-stats-item"
                                            icon={<User size={21} />}
                                            color='warning'
                                            stats={`${props.data.teachersCount}`}
                                            statTitle={t('Teachers')}
                                        />
                                    </Col>
                                    <Col xl='2' md='4' sm='6' className="d-none">
                                        <StatsVertical
                                            className="shadow-stats-item"
                                            icon={<TrendingUp size={21} />}
                                            color='danger'
                                            stats='97.8k'
                                            statTitle={t('Revenue')}
                                        />
                                    </Col>
                                    <Col xl='2' md='4' sm='6' className="d-none">
                                        <StatsVertical
                                            className="shadow-stats-item"
                                            icon={<TrendingDown size={21} />}
                                            color='primary'
                                            stats='26.8'
                                            statTitle={t('Cancellations')}
                                        />
                                    </Col>
                                    <Col xl='4' md='4' sm='6'>
                                        <StatsVertical
                                            className="shadow-stats-item"
                                            icon={<Book size={21} />}
                                            color='success'
                                            stats='689'
                                            statTitle={t('E-Book Sales')}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm='12' md='6' lg='3'>
                                        <StatsItemCard
                                            label={t("New Students")}
                                            value={props.data.newStudentsCount}
                                        />
                                    </Col>
                                    <Col sm='12' md='6' lg='3'>
                                        <StatsItemCard
                                            label={t("New Teachers")}
                                            value={props.data.newTeachersCount}
                                        />
                                    </Col>
                                    <Col sm='12' md='6' lg='3'>
                                        <StatsItemCard
                                            label={t("E-Book Sales")}
                                            value={0}
                                        />
                                    </Col>
                                    <Col sm='12' md='6' lg='3'>
                                        <StatsItemCard
                                            label={t("Sub Payments")}
                                            value={0}
                                        />
                                    </Col>
                                </Row>
                                <div className="shadow-stats-item mt-3">
                                    <h5 className="p-1">
                                        {t('Teachers')}
                                    </h5>
                                    {
                                        props.data.teachers.length == 0 &&
                                        <div className="text-center">
                                            {t('No Teacher Found')}
                                        </div>
                                    }
                                    {
                                        props.data.teachers.length > 0 &&
                                        <Table responsive hover >
                                            <thead>
                                                <tr>
                                                    <th>{t('Name')}</th>
                                                    <th>{t('Email')}</th>
                                                    <th>{t('DATE/TIME')}</th>
                                                    <th>{t('Action')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.teachers.filter((tea, i) => i < 5).map((teacher, index) =>
                                                    <tr key={'teachers' + index} >
                                                        <td>
                                                            {teacher.name}
                                                        </td>
                                                        <td>
                                                            {teacher.email}
                                                        </td>
                                                        <td><DateTime dateTime={t.createdAt} /></td>
                                                        <td>
                                                            <Button.Ripple color='flat-primary'
                                                                onClick={() => handleViewTeacher(teacher)}
                                                            >
                                                                {t('View')}
                                                            </Button.Ripple>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    }
                                </div>
                                <div className="shadow-stats-item mt-3">
                                    <h5 className="p-1">
                                        {t('Students')}
                                    </h5>
                                    {
                                        props.data.teachers.length == 0 &&
                                        <div className="text-center">
                                            {t('No Student Found')}
                                        </div>
                                    }
                                    {
                                        props.data.students.length > 0 &&
                                        <Table responsive hover >
                                            <thead>
                                                <tr>
                                                    <th>{t('Name')}</th>
                                                    <th>{t('Email')}</th>
                                                    <th>{t('DATE/TIME')}</th>
                                                    <th>{t('Action')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.data.students.filter((std, i) => i < 5).map((s, index) =>
                                                    <tr key={'student' + index} >
                                                        <td>
                                                            {s.name}
                                                        </td>
                                                        <td>
                                                            {s.email}
                                                        </td>
                                                        <td><DateTime dateTime={s.createdAt} /></td>
                                                        <td>
                                                            <Button.Ripple color='flat-primary'
                                                                onClick={() => handleViewStudent(s)}
                                                            >
                                                                {t('View')}
                                                            </Button.Ripple>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    }
                                </div>
                            </>
                        }
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        data,
        error,
        loading,
    } = state.Dashboard

    return {
        data,
        error,
        loading,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getDashboardData
    })(Dashboard)
)
