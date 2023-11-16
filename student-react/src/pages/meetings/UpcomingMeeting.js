import React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@components/avatar';
import { Bell, Calendar } from 'react-feather';
import {
	Card,
	CardTitle,
	CardBody,
	CardText,
	Media,
	Button,
} from 'reactstrap';
import { useSkin } from '@hooks/useSkin';
import { DateTime } from '../../components/date-time';

import { getMeetingToken } from '@store/actions';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import UILoader from '../../@core/components/ui-loader';

import { MEETING_APP_URL } from '../../helpers/url_helper'
import { useTranslation } from 'react-i18next';
import { AddMeetingToCalendarButton } from './addMeetingToCalendar'

const UpcomingMeeting = (props) => {

	const { t } = useTranslation()
	const { meeting } = props
	const [skin, setSkin] = useSkin();
	const [meetingUrl, setMeetingUrl] = useState(null);
	const [isActive, setIsActive] = useState(false)


	const data = [{
		title: 'Hello',
		img: 'https://pv-magazine-usa.com/wp-content/uploads/sites/2/2019/10/FordEV-1200x800.jpeg'
	}]
	const illus =
		skin === 'dark' ? 'upcoming-meeting-dark.svg' : 'upcoming-meeting.svg';
	const illustration = require(`@src/assets/images/illustrations/${illus}`);



	useEffect(() => {
		if (!props.meetingToken || props.meetingTokenError)
			props.getMeetingToken()
	}, []);

	const handleJoin = (e) => {
		e.preventDefault();
		if (meetingUrl) {
			window.open(meetingUrl);
		}
	}

	useEffect(() => {
		if (props.meetingToken) {
			let url = `${MEETING_APP_URL}/${meeting.meetingId}/${encodeURIComponent("JWT " + props.meetingToken)}`
			setMeetingUrl(url);
		}
	}, [props.meetingToken])



	return (
		<>
			{meeting && (
				<UILoader blocking={props.meetingTokenLoading} className="w-100 " >
					<Card className='card-developer-meetup  '>
						<div className='meetup-img-wrapper rounded-top text-center pt-3'>
							<img src={illustration} height='170' />
						</div>
						<CardBody>
							<div className='meetup-header d-flex align-items-center'>
								<div className='meetup-day'>
									<h6 className='mb-0'><DateTime dateTime={meeting.scheduledAt} format="ddd" /></h6>
									<h3 className='mb-0'><DateTime dateTime={meeting.scheduledAt} format="DD" /></h3>
								</div>
								<div className='my-auto'>
									<CardTitle tag='h4' className='mb-25'>
										{t('Upcoming Meeting')}
									</CardTitle>
									<CardText className='mb-0'>
										{meeting.agenda}
									</CardText>
								</div>
							</div>
							<div className='mb-1 mb-md-0 mb-lg-0 float-md-right float-lg-right'>
								<AddMeetingToCalendarButton className="mr-1" type="button" meeting={meeting} />
								<a target="_blank" onClick={(e) => handleJoin(e)}>
									<Button.Ripple className='mr-1' color='primary'>
										{t('Join')}
									</Button.Ripple>
								</a>
							</div>
							<Media>
								<Avatar
									color='light-primary'
									className='rounded mr-1'
									icon={<Calendar size={18} />}
								/>
								<Media body>
									<h6 className='mb-0'><DateTime dateTime={meeting.scheduledAt} format="ddd DD MMM, YYYY" /></h6>
									<small><DateTime dateTime={meeting.scheduledAt} type="time" /></small>
								</Media>
							</Media>
						</CardBody>
					</Card>
				</UILoader>
			)}
		</>
	);
};


const mapStateToProps = (state) => {
	const {
		meetingToken,
		meetingTokenLoading,
		meetingTokenError
	} = state.Meetings;
	return {
		meetingToken,
		meetingTokenLoading,
		meetingTokenError
	};
};

export default withRouter(
	connect(mapStateToProps, {
		getMeetingToken
	})(UpcomingMeeting)
)
