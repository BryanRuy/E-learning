import React, { useState, useEffect } from 'react'

import { Button } from 'reactstrap';
import { Bell, } from 'react-feather';

import { getCurrentTimeZone, getGoogleCalendarFormattedDate } from '../../components/date-time';

import ApiCalendar from 'react-google-calendar-api';
import { useTranslation } from 'react-i18next';
import { notifySuccess, notifyWarning } from '../../utility/toast'
import moment from 'moment';

export const AddMeetingToCalendarButton = (props) => {

    const { t } = useTranslation()
    const { meeting, type, className } = props

    const [isCalendarSignIn, setIsCalendarSignIn] = useState(false)
    const [isRemindMe, setIsRemindMe] = useState(false)

    useEffect(() => {
        ApiCalendar.onLoad(() => {
            ApiCalendar.listenSign(() => {
                setIsCalendarSignIn(ApiCalendar.sign)
            })
        })
    }, [])

    const addMeetingToCalendar = () => {
        if (!meeting) return notifyWarning(t("Meeting"),t('Could not add meeting to google calendar. Please try again'))
        let participants = meeting.participants.map(participant => participant.user.name).join(' - ');
        const event = {
            summary: `${meeting.agenda} ${participants}`,
            start: {
                'dateTime': getGoogleCalendarFormattedDate(meeting.scheduledAt),
                'timeZone': getCurrentTimeZone()
            },
            end: {
                'dateTime': getGoogleCalendarFormattedDate(moment.utc(meeting.scheduledAt).add(1, 'hour')),
                'timeZone': getCurrentTimeZone()
            },
            description: `${meeting.meetingId}`
        };
        ApiCalendar.createEvent(event)
            .then((result) => {
                setIsRemindMe(false)
                notifySuccess(t("Meeting"), t(`Meeting has been added to your Google Calendar`))
            })
            .catch((error) => {
                setIsRemindMe(false)
            });
    }

    const getCalendarEvents = () => {

        ApiCalendar.listEvents({
            timeMin: moment(meeting.scheduledAt).toISOString(),
        }).then(({ result }) => {
            // console.log("Events", result.items)
            let exist = false
            result.items.forEach(e => {
                if (e.description == meeting.meetingId)
                    exist = true
            });
            if (exist) {
                notifySuccess(t("Meeting"), t(`Meeting has been added to your Google Calendar`))
                setIsRemindMe(false);
                return
            }
            addMeetingToCalendar()

        });
    }

    useEffect(() => {
        if (ApiCalendar.sign && isRemindMe) {
            getCalendarEvents()
        }
    }, [isCalendarSignIn, isRemindMe])

    const handleRemindMe = () => {
        setIsRemindMe(true)
        if (!ApiCalendar.sign) {
            ApiCalendar.handleAuthClick()
        } else {
            setIsCalendarSignIn(true)
        }
    }

    return <>
        {
            type == "button"
                ?
                <Button.Ripple
                    className={`${className}`}
                    outline
                    color='primary'
                    onClick={() => handleRemindMe()}
                >
                    <Bell size={14} />
                    <span className='align-middle ml-25'>
                        {t('Remind Me')}
                    </span>
                </Button.Ripple>
                :
                <Button.Ripple
                    color='primary'
                    className={`${className} btn btn-icon`}
                    onClick={() => handleRemindMe()}
                >
                    <Bell size={14} />
                </Button.Ripple>
        }
    </>
}
