import React, { useState, useEffect } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col,
    Button, Table, Badge
} from 'reactstrap'

// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
    getUserData,
    getAllMeetings,
    getNewAssignments,
    getUpcomingTests,
    getRecentLessons,
    getIncompleteLessonsCount,
    selectLesson,
    selectTopic
} from '../../store/actions'
import UILoader from '../../@core/components/ui-loader';
import { DateTime } from '../../components/date-time'
import { GET_BLOG_IMAGE_URL } from '../../helpers/url_helper'

import { titleCase } from "@utils";
import UpcomingMeeting from '../meetings/UpcomingMeeting';
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import './style.scss'
import { getMeetingStatusColor } from '../meetings/util';

const Dashboard = (props) => {

    const { t } = useTranslation()
    const [upcomingAssignmentsData, setUpcomingAssignmentsData] = useState([])
    const [upcomingTestData, setUpcomingTestsData] = useState([])
    const [pendingMeetings, setPendingMeetings] = useState([])

    useEffect(() => {
        props.getUserData();
        props.getUpcomingTests();
        props.getNewAssignments({ page: 1, limit: 20 });
        props.getAllMeetings({ page: 1, limit: 100 });
        props.getRecentLessons();
        props.getIncompleteLessonsCount();
    }, [])

    const getUpcomingMeeting = () => {
        let upcomingMeetings = props.meetings.filter(m => m.status == 'accepted' && moment(m.scheduledAt).isSameOrAfter(moment()))
        if (upcomingMeetings.length == 0) return null
        return upcomingMeetings[upcomingMeetings.length - 1]
    }

    const handleLesson = (lesson) => {
        props.selectTopic(lesson.topic);
        props.selectLesson(lesson.id);
        props.history.push('/lessons')
    }

    useEffect(() => {
        if (props.newAssignments.data) setUpcomingAssignmentsData(props.newAssignments.data)
    }, [props.newAssignments])

    useEffect(() => {
        setUpcomingTestsData(props.newTests.data)
    }, [props.newTests])

    useEffect(() => {
        let pendingMeetings = props.meetings.filter(
            (m) =>
                m.status == "pending" && moment(m.scheduledAt).isSameOrAfter(moment())
        );
        setPendingMeetings(pendingMeetings);

    }, [props.meetings]);

    return (
        <Fragment >
            <UILoader
                blocking={
                    props.meetingsLoading
                    || props.recentLessonsLoading
                    || props.newTestsLoading
                    || props.newAssignmentsLoading
                    || props.incompleteLessonsLoading
                }
            >
                <Card>
                    <CardBody >
                        <Row>
                            <Col sm='12' md='6' lg='3'>
                                <div
                                    className="dashboard-stats-item shadow-container">
                                    <div className="heading">
                                        {t('Upcoming')} <br /> {t('Tests')}
                                    </div>
                                    {
                                        upcomingTestData &&
                                        <div className="count text-primary">
                                            {
                                                upcomingTestData.length
                                            }
                                        </div>
                                    }

                                </div>
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <div
                                    className=" dashboard-stats-item shadow-container">
                                    <div className="heading">
                                        {t("Upcoming")} <br /> {t('Assignments')}
                                    </div>
                                    {
                                        upcomingAssignmentsData &&
                                        <div className="count text-primary">
                                            {
                                                upcomingAssignmentsData.length
                                            }
                                        </div>
                                    }
                                </div>
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <div
                                    className=" dashboard-stats-item shadow-container">
                                    <div className="heading">
                                        {t('Incomplete')} <br /> {t('Lessons')}
                                    </div>
                                    <div className="count text-primary">
                                        {
                                            props.incompleteLessons
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col sm='12' md='6' lg='3'>
                                <div
                                    className=" dashboard-stats-item shadow-container">
                                    <div className="heading">
                                        {t('Upcoming')} <br /> {t('Meetings')}
                                    </div>
                                    {
                                        props.meetings && 
                                        <div className="count text-primary">
                                            {
                                                props.meetings.filter(m => m.status == 'accepted' && moment(m.scheduledAt).isSameOrAfter(moment())).length
                                            }
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            {getUpcomingMeeting() && (
                                <Col sm="12" md="12" lg="6">
                                    <div className="shadow-container">
                                        <UpcomingMeeting meeting={getUpcomingMeeting()} />
                                    </div>
                                </Col>
                            )}
                            <Col
                                sm="12"
                                md="12"
                                lg={getUpcomingMeeting() ? "6" : ""}
                                className="d-flex"
                            >
                                <div
                                    className={`h-100 w-100 shadow-container  ${getUpcomingMeeting() ? "ml-lg-2" : ""
                                        }`}
                                >
                                    <div
                                        className={`d-flex align-items-center justify-content-between p-1`}
                                    >
                                        <h5 className="m-0">{t("Meetings")}</h5>
                                    </div>
                                    {!props.meetingsLoading && props.meetingsError && (
                                        <div className="text-center p-1">{props.meetingsError}</div>
                                    )}
                                    {!props.meetingsLoading &&
                                        !props.meetingsError &&
                                        pendingMeetings &&
                                        pendingMeetings.length == 0 && (
                                            <div className="text-center p-1">
                                                {t("No pending meetings found")}
                                            </div>
                                        )}
                                    {!props.meetingsLoading &&
                                        !props.meetingsError &&
                                        pendingMeetings.length > 0 && (
                                            <Table responsive hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>{t("Subject")}</th>
                                                        <th>{t("Date")}</th>
                                                        <th>{t("Time")}</th>
                                                        <th>{t("Status")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingMeetings.map((m, index) => (
                                                        <tr key={m.meetingId}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <span className="align-middle font-weight-bold">
                                                                    {m.agenda}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <DateTime
                                                                    dateTime={m.scheduledAt}
                                                                    type="date"
                                                                />
                                                            </td>
                                                            <td>
                                                                <DateTime
                                                                    dateTime={m.scheduledAt}
                                                                    type="time"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Badge
                                                                    pill
                                                                    color={getMeetingStatusColor(m.status)}
                                                                    className="mr-1"
                                                                >
                                                                    {titleCase(m.status)}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-3 ">
                            <Col sm='12' md='12' lg='6'>
                                <div className="shadow-container">
                                    <div className={`d-flex align-items-center justify-content-between p-1`}>
                                        <h5>
                                            {t('Upcoming')} {t('Tests')}
                                        </h5>
                                        <Button.Ripple
                                            color='flat-primary'
                                            onClick={() => props.history.push("/tests")}
                                        >
                                            {t('View All')}
                                        </Button.Ripple>
                                    </div>
                                    {
                                        !props.newTestsLoading &&
                                        props.newTestsError &&
                                        <div className="text-center pb-4 pt-4">
                                            {props.newTestsError}
                                        </div>
                                    }
                                    {
                                        !props.newTestsLoading &&
                                        !props.newTestsError &&
                                        upcomingTestData &&
                                        upcomingTestData.length == 0 &&
                                        <div className="text-center pb-4 pt-4">
                                            {t('No test found')}
                                        </div>
                                    }
                                    {
                                        !props.newTestsLoading &&
                                        !props.newTestsError &&
                                        upcomingTestData &&
                                        upcomingTestData.length > 0 &&
                                        <Table responsive hover>
                                            <thead>
                                                <tr>
                                                    <th>{t('Test')}</th>
                                                    <th>{t('Start Time')}</th>
                                                    <th>{t('Duration')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upcomingTestData.map((t, index) =>
                                                    <tr key={'test-key' + index}>
                                                        <td>
                                                            <span className='align-middle font-weight-bold'>
                                                                {t.test.title}
                                                            </span>
                                                        </td>
                                                        <td><DateTime dateTime={t.startTime} type="date" /></td>
                                                        <td>{t.test.timeLimit / 60} mins</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    }
                                </div>
                            </Col>
                            <Col sm='12' md='12' lg='6'>
                                <div className='shadow-container'>
                                    <div className={`d-flex align-items-center justify-content-between p-1`}>
                                        <h5 className='m-0'>
                                            {t('Upcoming')} {t('Assignments')}
                                        </h5>
                                        <Button.Ripple
                                            color='flat-primary'
                                            onClick={() => props.history.push("/assignments")}
                                        >
                                            {t('View All')}
                                        </Button.Ripple>
                                    </div>
                                    {
                                        !props.newAssignmentsLoading &&
                                        props.newAssignmentsError &&
                                        <div className="text-center pb-4 pt-4">
                                            {props.newAssignmentsError}
                                        </div>
                                    }
                                    {
                                        !props.newAssignmentsLoading &&
                                        !props.newAssignmentsError &&
                                        upcomingAssignmentsData &&
                                        upcomingAssignmentsData.length == 0 &&

                                        <div className="text-center pb-4 pt-4">
                                            {t('No Assignment found')}
                                        </div>
                                    }
                                    {
                                        !props.newAssignmentsLoading &&
                                        !props.newAssignmentsError &&
                                        upcomingAssignmentsData &&
                                        upcomingAssignmentsData.length > 0 &&
                                        <Table responsive hover >
                                            <tbody>
                                                {upcomingAssignmentsData.filter((na, i) => i < 9).map((a, index) =>
                                                    <tr key={"recent-lesson" + index}>
                                                        <td>
                                                            <div
                                                                className="d-flex justify-content-between align-items-center"
                                                            >
                                                                <div>
                                                                    {a.assignment.title}
                                                                </div>
                                                                <div className="text-primary">
                                                                    <DateTime dateTime={a.endDate} type="date" />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}</tbody>
                                        </Table>
                                    }
                                </div>
                            </Col>
                        </Row>

                        <div className="pt-3">
                            <h5>
                                {t('Recent Lessons')}
                            </h5>
                            <Row>
                                {
                                    !props.recentLessonsLoading &&
                                    !props.recentLessonsError &&
                                    props.recentLessons.length == 0 &&
                                    <Col lg='12' className='text-center'>
                                        {t('No lesson found')}
                                    </Col>
                                }
                                {
                                    !props.recentLessonsLoading &&
                                    props.recentLessonsError &&
                                    <Col lg='12' className='text-center'>
                                        {props.recentLessonsError}
                                    </Col>
                                }
                                {
                                    props.recentLessons.length > 0 &&
                                    !props.recentLessonsError &&
                                    props.recentLessons.map((l, index) =>
                                        <Col
                                            key={'topic-key-' + index}
                                            sm='12' md='6' lg='6'
                                            className='pl-1 pr-1 pb-1 '
                                            onClick={() => handleLesson(l)}
                                        >
                                            <div
                                                className={`topic-item`}
                                            >
                                                <div
                                                    className="topic-image"
                                                    style={{
                                                        backgroundImage: `url(${GET_BLOG_IMAGE_URL(l.topic.image.formats.thumbnail.url)})`
                                                    }}
                                                >
                                                </div>
                                                <div className="topic-content">
                                                    <div
                                                        className="heading"
                                                    >
                                                        {l.title}
                                                    </div>
                                                    <div className="description">
                                                        {l.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                }
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        meetings,
        meetingsLoading,
        meetingsError,

    } = state.Meetings;
    const {
        newAssignments,
        newAssignmentsLoading,
        newAssignmentsError,
    } = state.Assignments;
    const {
        newTests,
        newTestsLoading,
        newTestsError,
    } = state.Tests;
    const {
        recentLessons,
        recentLessonsLoading,
        recentLessonsError,
        incompleteLessons,
        incompleteLessonsLoading,
        incompleteLessonsError,
    } = state.Lessons;
    return {
        meetings,
        meetingsLoading,
        meetingsError,

        newAssignments,
        newAssignmentsLoading,
        newAssignmentsError,

        newTests,
        newTestsLoading,
        newTestsError,

        recentLessons,
        recentLessonsLoading,
        recentLessonsError,

        incompleteLessons,
        incompleteLessonsLoading,
        incompleteLessonsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getUserData,
        getAllMeetings,
        getNewAssignments,
        getUpcomingTests,
        getRecentLessons,
        getIncompleteLessonsCount,
        selectLesson,
        selectTopic
    })(Dashboard)
)
