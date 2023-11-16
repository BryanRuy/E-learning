import React from 'react'

import {
    Badge,
    Row,
    Col,
    Media
} from 'reactstrap';

import { Calendar } from 'react-feather'
import { getMeetingStatusColor } from './util';

import { DateTime } from '../../components/date-time';

import { titleCase } from '@utils';

import Avatar from '@components/avatar'
import { GET_IMAGE_URL } from './../../helpers/url_helper';
import { useTranslation } from 'react-i18next';

export const MeetingPreview = (props) => {
    const { t } = useTranslation()
    const { meeting, user } = props
    return meeting && user &&
        <>
            <Row>
                <Col sm={12} md={2} className="mt-1">
                    <div className="text-center">
                        <Avatar className='box-shadow-1 avatar-border'
                            img={GET_IMAGE_URL(meeting.participants.find(u => u.user.userId != user.userId).user.profilePicture)}
                            size='lg' />
                    </div>
                </Col>
                <Col sm={12} md={5} className="mt-1">
                    <h5>
                        {meeting.participants.find(u => u.user.userId != user.userId).user.name}
                    </h5>
                    <div className="mt-25">
                        <Badge
                            pill
                            color={getMeetingStatusColor(meeting.status)}
                            className='mr-1'
                        >
                            {titleCase(meeting.status)}
                        </Badge>
                    </div>
                </Col>
                <Col sm={12} md={5} className="mt-1">
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
                </Col>
            </Row>
            <Row className="mt-4">
                <Col sm={12} md={2}>
                    <h6>{t('Agenda')}</h6>
                </Col>
                <Col sm={12} md={10}>
                    {meeting.agenda}
                </Col>
            </Row>
            {
                meeting.message &&
                <Row className="mt-2">
                    <Col sm={12} md={2}>
                        <h6>{t('Personal Message')}</h6>
                    </Col>
                    <Col sm={12} md={10} >
                        {meeting.message}
                    </Col>
                </Row>
            }
        </>

}