// ** React Imports
import React, { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Row, Col, Button, Modal, ModalBody } from 'reactstrap'
import { ArrowLeft, X } from 'react-feather'

// ** Calendar App Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'

import { filters } from './util'

// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
  getAllMeetings,
  getNewAssignments,
  getUpcomingTests,
  getRecentLessons,
  selectLesson,
  selectTopic,
  selectAssignment
} from '../../store/actions'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { MeetingPreview } from '../meetings/meetingPreview'
import { getLoggedInUser } from '../../helpers/backend-helpers'

// ** Styles
import '@styles/react/apps/app-calendar.scss'

import UILoader from '../../@core/components/ui-loader';

import { DateTimeFunction } from '../../components/date-time'
const CalendarComponent = (props) => {

  const { t } = useTranslation()
  const [event, setEvent] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState(filters.map(f => f.type))
  const [upcomingTestData, setUpcomingTestData] = useState([])
  const [upcomingAssignmentData, setUpcomingAssignmentData] = useState([])

  useEffect(() => {
    if (props.newTests && props.newTests.data) setUpcomingTestData(props.newTests.data)
  }, [props.newTests])

  useEffect(() => {
    if (props.upcomingAssignments && props.upcomingAssignments.data) setUpcomingAssignmentData(props.upcomingAssignments.data)
  }, [props.upcomingAssignments])

  useEffect(() => {
    props.getUpcomingTests();
    props.getNewAssignments();
    props.getAllMeetings({ page: 1, limit: 10 });
    props.getRecentLessons();
  }, [])

  const toggleAllFilter = (checked) => {
    if (checked) return setSelectedFilters(filters.map(f => f.type))
    setSelectedFilters([])
  }

  const toggleFilter = (type) => {
    if (selectedFilters.find(f => f == type)) return setSelectedFilters(selectedFilters.filter(f => f != type))
    setSelectedFilters([...selectedFilters, type])
  }

  const toggleSidebar = val => setLeftSidebarOpen(val)

  const eventsList = () => {
    return [
      ...props.meetings.map(mt => {
        return {
          type: 'meeting',
          title: mt.agenda,
          date: moment(mt.scheduledAt).format('YYYY-MM-DD'),
          data: mt
        }
      }),
       ...upcomingTestData.map(t => {
        return {
          type: 'test',
          title: t.test.title,
          date: moment(t.startTime).format('YYYY-MM-DD'),
          data: t
        }
      }),
    
      ...upcomingAssignmentData.map(a => {
        return {
          type: 'assignment',
          title: a.assignment.title,
          date: moment(a.startDate).format('YYYY-MM-DD'),
          data: a
        }
      }),
      ...props.recentLessons.map(l => {
        return {
          type: 'lesson',
          title: l.title,
          date: moment(l.created_at).format('YYYY-MM-DD'),
          data: l
        }
      })

    ]
  }

  const filteredEvents = () => {
    let events = eventsList()
    let c = events.filter(e => selectedFilters.find(f => f == e.type))
    return events.filter(e => selectedFilters.find(f => f == e.type))
  }

  const handleLesson = (lesson) => {
    props.selectTopic(lesson.topic);
    props.selectLesson(lesson.id);
    props.history.push('/lessons')
  }

  const handleAssignment = (assignment) => {
    props.selectAssignment(assignment)
    props.history.push(`/assignments/details`)
  }

  const handleEvent = (e) => {
    setEvent(e)
  }

  const meetingPreview = (e) => {
    return <div>
      <h5>
        {t('Meetings')}
      </h5>
      <MeetingPreview meeting={e.data} user={getLoggedInUser()} />
      <div className="text-right">
        <Button.Ripple
          color='primary'
          onClick={() => props.history.push('/meetings')}
        >
          {t('View All')}
        </Button.Ripple>
        <Button.Ripple
          color='secondary'
          className="ml-1"
          onClick={() => setEvent(null)}
        >
          {t('Dismiss')}
        </Button.Ripple>
      </div>
    </div>

  }

  const lessonPreview = (e) => {
    return <div className="text-left">
      <h5>{t('Lessons')}</h5>
      <div className="form-group">
        <label >{t('Topic')}</label>
        <input className="form-control" disabled value={e.data.topic.title} />
      </div>
      <div className="form-group">
        <label >{t('Lesson')}</label>
        <input className="form-control" disabled value={e.data.title} />
      </div>
      <div className="form-group">
        <label >{t('Lesson Details')}</label>
        <textarea className="form-control" value={e.data.description} disabled rows="5"></textarea>
      </div>
      <div className="text-right">
        <Button.Ripple
          color='primary'
          onClick={() => handleLesson(e.data)}
        >
          {t('View')}
        </Button.Ripple>
        <Button.Ripple
          color='secondary'
          className="ml-1"
          onClick={() => setEvent(null)}
        >
          {t('Dismiss')}
        </Button.Ripple>
      </div>

    </div>
  }

  const testPreview = (e) => {
    return <div className="text-left">
      <h5>
        {t('Test')}
      </h5>
      <div className="form-group">
        <label >{t('Title')}</label>
        <input className="form-control" disabled value={e.data.test.title} />
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <div className="form-group">
            <label >{t('Starting At')}</label>
            <input className="form-control" disabled value={DateTimeFunction(e.data.startDate)} />
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="form-group">
            <label >{t("Ending At")}</label>
            <input className="form-control" disabled value={DateTimeFunction(e.data.endDate)} />
          </div>
        </div>
      </div>
      <div className="form-group">
        <label >{t('Duration')}</label>
        <input className="form-control" disabled value={`${e.data.test.timeLimit / 60} mins`} />
      </div>
      <div className="text-right">
        <Button.Ripple
          color='primary'
          onClick={() => props.history.push("/tests")}
        >
          {t('View All')}
        </Button.Ripple>
        <Button.Ripple
          color='secondary'
          className="ml-1"
          onClick={() => setEvent(null)}
        >
          {t('Dismiss')}
        </Button.Ripple>
      </div>
    </div>
  }

  const assignmentPreview = (e) => {
    return <div className="text-left">
      <h5>
        {t('Assignment')}
      </h5>
      <div className="form-group">
        <label >{t('Title')}</label>
        <input className="form-control" disabled value={e.data.assignment.title} />
      </div>
      <div className="form-group">
        <label >{t('Assignment Type')}</label>
        <input className="form-control" disabled value={e.data.assignment.type.toUpperCase()} />
      </div>
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <div className="form-group">
            <label >{t('Starting At')}</label>
            <input className="form-control" disabled value={DateTimeFunction(e.data.startDate)} />
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="form-group">
            <label >{t('Ending At')}</label>
            <input className="form-control" disabled value={DateTimeFunction(e.data.endDate)} />
          </div>
        </div>
      </div>
      <div className="text-right">
        {
          (moment().isAfter(moment(e.data.startDate))
            || moment().isSame(moment(e.data.startDate))
            || moment().isBefore(moment(e.data.endDate))
            || moment().isSame(moment(e.data.endDate))
          ) &&
          <Button.Ripple
            color='primary'
            onClick={() => handleAssignment(e.data)}
          >
            {t('Start')}
          </Button.Ripple>
        }

        <Button.Ripple
          color='secondary'
          className="ml-1"
          onClick={() => setEvent(null)}
        >
          {t('Dismiss')}
        </Button.Ripple>
      </div>
    </div>
  }

  return (
    <Fragment>
      <UILoader blocking={
        props.meetingsLoading ||
        props.newAssignmentsLoading ||
        props.newTestsLoading ||
        props.recentLessonsLoading
      } >
        <div className='app-calendar overflow-hidden border'>
          <Row noGutters>
            <Col lg='12' className="d-flex align-items-center">
              <Button.Ripple color='flat-primary'
                className="btn btn-icon"
                onClick={() => props.history.goBack()}
              >
                <ArrowLeft />
              </Button.Ripple>
              <h4 className="m-0 ml-1">{t('Calendar')}</h4>
            </Col>
            <Col
              id='app-calendar-sidebar'
              className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
                show: leftSidebarOpen
              })}
            >
              <SidebarLeft
                filters={filters}
                selectedFilters={selectedFilters}
                toggleFilter={toggleFilter}
                toggleAllFilter={toggleAllFilter}
              />
            </Col>
            <Col className='position-relative'>
              <Calendar
                events={filteredEvents()}
                toggleSidebar={setLeftSidebarOpen}
                handleEvent={handleEvent}
              />
            </Col>
            <div
              className={classnames('body-content-overlay', {
                show: leftSidebarOpen === true
              })}
              onClick={() => toggleSidebar(false)}
            ></div>
          </Row>
        </div>
      </UILoader>
      {
        event &&
        <Modal isOpen={true} className="pt-5">
          <ModalBody className="pb-1">
            <div className="text-right">
              <X
                size={16}
                onClick={() => setEvent(null)}
              />
            </div>
            {
              event.type == "meeting" &&
              meetingPreview(event)
            }
            {
              event.type == "test" &&
              testPreview(event)
            }
            {
              event.type == "lesson" &&
              lessonPreview(event)
            }
            {
              event.type == "assignment" &&
              assignmentPreview(event)
            }
          </ModalBody>
        </Modal>
      }

    </Fragment>
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
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getAllMeetings,
    getNewAssignments,
    getUpcomingTests,
    getRecentLessons,
    selectLesson,
    selectTopic,
    selectAssignment
  })(CalendarComponent)
)
