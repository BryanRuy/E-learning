import React, { useEffect } from 'react';
import { Bell, Plus } from 'react-feather';

import {
	CardTitle,
	CardBody,
	CardText,
	Button,
	Row,
	Col
} from 'reactstrap';
import Fade from 'reactstrap/lib/Fade';
import { DateTime } from '../../components/date-time'
import CardReload from '@components/card-reload'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AddMeetingToCalendarButton } from './addMeetingToCalendar'
import {
	getMeetingDates, newMeeting, getStudentsForMeeting
} from '@store/actions';

import moment from 'moment';
import { useTranslation } from 'react-i18next';



const UpcomingMeetingItem = ({ meeting }) => {
	return (
		<Row className='upcoming-meeting-item'>
			<Col xs={10}>
				<div className='meetup-header d-flex align-items-center'>
					<div className='meetup-day'>
						<h6 className='mb-0'><DateTime dateTime={meeting.scheduledAt} format="ddd" /></h6>
						<h3 className='mb-0'><DateTime dateTime={meeting.scheduledAt} format="DD" /></h3>
					</div>
					<div className='my-auto'>
						<CardTitle tag='h4' className='mb-25'>
							{meeting.agenda}
						</CardTitle>
						<CardText className='mb-0'>
							<DateTime dateTime={meeting.scheduledAt} format="ddd DD MMM, YYYY" />
						</CardText>
					</div>
				</div>
			</Col>
			<Col xs={2}>
				<Fade>
					<AddMeetingToCalendarButton
						className='remind-me-btn btn-icon'
						type="button-icon"
						meeting={meeting}
					/>
				</Fade>
			</Col>
		</Row>
	);
};

const UpcomingMeetings = props => {
	const { t } = useTranslation()
	const { addNewMeeting } = props
	return (
		<>
			{
				props.meetings
				&& props.meetings.length > 0
				&& (
					<CardReload
						title={`${t('Upcoming')} ${t("Meetings")}`}
						className='card-developer-meetup card-upcoming-meetings'
						isReloading={props.meetingsLoading}
					>
						<CardBody>
							<div className='upcoming-meeting-list'>
								{props.meetings
									.filter(m => m.status == 'accepted' && moment.utc(m.scheduledAt).isSameOrAfter(moment.utc().subtract(30,'minutes')))
									.map(meeting => <UpcomingMeetingItem key={meeting.meetingId} meeting={meeting} />)}
							</div>
							<Button.Ripple
								className='btn-block btn-icon'
								color='primary'
								onClick={() => addNewMeeting()}
							>
								<Plus size={14} /> {t('New Meeting')}
							</Button.Ripple>
						</CardBody>
					</CardReload>
				)}

		</>
	);
};


const mapStateToProps = state => {
	const {
		meetings,
		meetingsLoading,
		meetingsDates,
		meetingsDatesLoading,
		meetingsDatesError,
		newMeetingLoading,
		newMeetingError,
		students,
		studentLoading,
		studentsError,

	} = state.Meetings;
	return {
		meetings,
		meetingsLoading,
		meetingsDates,
		meetingsDatesLoading,
		meetingsDatesError,
		newMeetingLoading,
		newMeetingError,
		students,
		studentLoading,
		studentsError,
	}
}

export default withRouter(connect(mapStateToProps, {
	getMeetingDates, newMeeting,
	getStudentsForMeeting
})(UpcomingMeetings))
