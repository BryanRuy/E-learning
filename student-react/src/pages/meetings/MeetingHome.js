import React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, } from 'reactstrap';
import MeetingList from './MeetingList';
import UpcomingMeeting from './UpcomingMeeting';
import UpcomingMeetings from './UpcomingMeetings';
import { getAllMeetings, getMeetingDates, newMeeting, getCurrentTeacher } from '@store/actions';

import UILoader from '../../@core/components/ui-loader';

import { Form, FormGroup, Modal, ModalBody, Input, Label, InputGroup, Button } from 'reactstrap';
import { X, Plus } from 'react-feather'
import { notifyError, notifySuccess } from '../../utility/toast'


import Avatar from '@components/avatar'
import { GET_IMAGE_URL } from './../../helpers/url_helper';
import { getLoggedInUser } from './../../helpers/backend-helpers';

import moment from 'moment';

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';

import TimePicker from '@components/datepicker/TimePicker';
import DatePicker from '@components/datepicker/DatePicker';
import { useTranslation } from 'react-i18next';

const newMeetingImg = require("../../assets/images/illustrations/new-meeting.svg")

const close = (
	<button type='button' className='ml-1 close'>
		<span>×</span>
	</button>
)

function MeetingHome(props) {

	const { t } = useTranslation();
	const getUpcomingMeetings = () => {
		const meetingList = props.meetings || [];
		return meetingList.filter(m => m.status == 'accepted'
								&& moment.utc(m.scheduledAt).isSameOrAfter(moment.utc().subtract(1,'hour')));
	}

	const upcomingMeetings = getUpcomingMeetings();

	const [isNewMeeting, setIsNewMeeting] = useState(false)
	const [user, setUser] = useState({})
	const [meetingList, setMeetingList] = useState([])

	const [agenda, setAgenda] = useState("")
	const [message, setMessage] = useState("")
	const [meetingDate, setMeetingDate] = useState(new Date())
	const [meetingTime, setMeetingTime] = useState(new Date('1970-01-01 10:00:00'))

	useEffect(() => {
		setUser(getLoggedInUser())
		props.getAllMeetings({ page: 1, limit: 10 })
	}, [])

	useEffect(() => {
		if (isNewMeeting && !props.newMeetingLoading && !props.newMeetingError) {
			closeMeeting()
			notifySuccess(t("New Meeting"), t("Meeting scheduled successfully"))
		}
		else if (isNewMeeting && !props.newMeetingLoading && props.newMeetingError) {
			notifyError(t("New Meeting"), props.newMeetingError)
		}

	}, [props.newMeetingLoading])

	const addNewMeeting = () => {

		setIsNewMeeting(true)
		props.getCurrentTeacher()
		// if (user && user.student) {
		// 	props.getMeetingDates(user.student.teacher.user.userId)
		// }
	}

	const closeMeeting = () => {
		setAgenda("");
		setMessage("")
		setMeetingDate(new Date())
		setMeetingTime(new Date('1970-01-01 10:00:00'))
		setIsNewMeeting(false)
	}

	const requestMeeting = (e) => {
		e.preventDefault()
		let date = moment(meetingDate)
		let time = moment(meetingTime)
		date.set('hour', time.get('hour')).set('minute', time.get('minute'))
		let data = {
			guest: user.student.teacher.user.userId,
			scheduledAt: date,
			agenda,
			message
		}
		if (!data.message) delete data.message
		props.newMeeting(data)
	}

	
	return (
		<>

			{
				props.meetings.length == 0 ?
					<div className=" mt-3 d-flex flex-column justify-content-center align-items-center">
						<img src={newMeetingImg} className="img w-25" />
						<h3>
							{t('It’s too lonely here')}
						</h3>
						<div>
							{t('Get started by scheduling your first meeting')}
						</div>
						<Button.Ripple
							color="primary"
							className="btm btn-sm mt-1"
							onClick={() => addNewMeeting()}
						>
							<Plus size={14} />
							{t('New Meeting')}
						</Button.Ripple>
					</div>
					:
					<Row>
						{
							props.meetings.filter(m => m.status == 'accepted'
								&& moment.utc(m.scheduledAt).isSameOrAfter(moment.utc().subtract(1,'hour'))).length == 0 ?
								<Col lg={12} className="mb-1">
									<div className="d-flex  align-items-center justify-content-between">
										<h3>{t('Meetings')}</h3>
										<Button.Ripple
											color="primary"
											onClick={() => addNewMeeting()}
										>
											<Plus size={14} />
											{t('New Meeting')}
										</Button.Ripple>
									</div>
								</Col>
								:
								<>
									<Col lg={7}>
										<UpcomingMeeting meeting={upcomingMeetings.length > 0 && upcomingMeetings[upcomingMeetings.length - 1]} />
									</Col>
									<Col lg={5} style={{ maxWidth: 500 }}>
										<UpcomingMeetings addNewMeeting={addNewMeeting} />
									</Col>
								</>
						}
						<Col lg={12}>
							<MeetingList />
						</Col>
					</Row>
			}
			<Modal isOpen={isNewMeeting || props.newMeetingLoading} className="pt-5">
				<UILoader blocking={props.meetingsDatesLoading || props.currentTeacherLoading || props.newMeetingLoading}>
					<ModalBody className="pb-1">
						<div className="text-right">
							<X
								size={16}
								onClick={() => closeMeeting()}
							/>
						</div>
						{
							!props.currentTeacherLoading &&
							props.currentTeacherError &&
							<NoNetwork message={props.currentTeacherError} />
						}
						{
							!props.currentTeacherLoading &&
							!props.currentTeacherError &&
							Object.keys(props.currentTeacher).length > 0 &&
							<>
								<div className="text-center">
									<Avatar className='box-shadow-1 avatar-border'
										img={GET_IMAGE_URL(props.currentTeacher.student.teacher.user.profilePicture)}
										size='xl' />
									<h5 className="mt-25 pt-1">
										{props.currentTeacher.student.teacher.user.name}
									</h5>
									<div className="text-secondary">
										{t('Teacher')}
									</div>
								</div>
								<Form
									className="mt-1 mb-2"
									onSubmit={e => requestMeeting(e)}>
									<Row>
										<Col lg='12'>
											<FormGroup>
												<Label className="ml-25">
													{t('Agenda')}
												</Label>
												<InputGroup className='input-group-merge'>
													<Input
														type="text"
														placeholder={t('Meeting Agenda')}
														value={agenda}
														onChange={e => setAgenda(e.target.value)}
														required />
												</InputGroup>
											</FormGroup>
										</Col>
										<Col md='12' lg='6'>
											<DatePicker
												value={meetingDate}
												onChange={setMeetingDate}
											// disableDates={props.meetingsDates.map(d => d.scheduledAt)}
											/>
										</Col>
										<Col md='12' lg='6'>
											<TimePicker
												value={meetingTime}
												onChange={setMeetingTime}
											/>
										</Col>
										<Col lg="12">
											<FormGroup>
												<Label className="ml-25">
													{t('Personal Message')}
												</Label>
												<InputGroup className='input-group-merge'>
													<Input
														type='textarea'
														rows='4'
														placeholder={t('Send a personal message')}
														value={message}
														onChange={e => setMessage(e.target.value)}
													/>
												</InputGroup>
											</FormGroup>
										</Col>
									</Row>
									<Button.Ripple type="submit" color='primary'>{t('Request Meeting')}</Button.Ripple>
								</Form>
							</>
						}
					</ModalBody>
				</UILoader>
			</Modal>

		</>
	);
}


const mapStateToProps = (state) => {
	const {
		meetingsCount,
		meetings,
		meetingsLoading,
		meetingsDates,
		meetingsDatesLoading,
		meetingsDatesError,
		newMeetingLoading,
		newMeetingError,
		currentTeacher,
		currentTeacherLoading,
		currentTeacherError,
	} = state.Meetings;
	return {
		meetingsCount,
		meetings,
		meetingsLoading,
		meetingsDates,
		meetingsDatesLoading,
		meetingsDatesError,
		newMeetingLoading,
		newMeetingError,
		currentTeacher,
		currentTeacherLoading,
		currentTeacherError,
	};
};

export default withRouter(
	connect(mapStateToProps, {
		getAllMeetings,
		getMeetingDates,
		newMeeting,
		getCurrentTeacher
	})(MeetingHome)
)
