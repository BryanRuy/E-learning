import React, { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Col,
    Input,
    Form,
    Button,
    CustomInput,
    Label
} from 'reactstrap'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { postFeedback } from '@store/actions'
import { useTranslation } from 'react-i18next';
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import UILoader from '../../@core/components/ui-loader'

const Feedback = (props) => {

    const { t } = useTranslation();
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (props.feedbackSuccess, props.feedbackResponse) {
            successAlertDialog(`${t('Your ticket has been created successfully with ticket ID:')} ${props.feedbackResponse.ticketId}`, () => clearForm())
        }
        if (props.feedbackError) {
            errorAlertDialog(t('Cannot register your support ticket at the moment'))
        }
    }, [props.feedbackSuccess, props.feedbackError])

    const clearForm = () => {
        setMessage("")
        setSubject("")
    }

    const subjectFeedback = () => {
        if (subject && message) {
            props.postFeedback({ subject, message })
        }
        else {
            errorAlertDialog(t('Please provide a valid subject and message.'))
        }
    }


    return (
        <UILoader blocking={props.feedbackLoading}>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>{t('Feedback')}</CardTitle>
                </CardHeader>

                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label sm='3' for='subject'>
                                {t('Subject')}
                            </Label>
                            <Col sm='9'>
                                <Input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    type='text'
                                    name='subject'
                                    id='subject'
                                    placeholder={t('Subject')}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Label sm='3' for='message'>
                                {t('Message')}
                            </Label>
                            <Col sm='9'>
                                <textarea
                                    value ={message}
                                    className="form-control"
                                    onChange={e => setMessage(e.target.value)}
                                    rows="6"
                                    name='message'
                                    id='message'
                                    placeholder={t('Message')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup >
                            <Col>
                                <Button.Ripple
                                    className='mr-1'
                                    color='primary'
                                    onClick={e => subjectFeedback()}>
                                    {t('Submit')}
                                </Button.Ripple>
                            </Col>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        </UILoader>

    )
}

const mapStateToProps = (state) => {
    const { feedbackLoading, feedbackSuccess, feedbackEerror, feedbackResponse } = state.Feedback;
    return { feedbackLoading, feedbackSuccess, feedbackEerror, feedbackResponse }
}

export default withRouter(
    connect(mapStateToProps, { postFeedback })(Feedback)
)
