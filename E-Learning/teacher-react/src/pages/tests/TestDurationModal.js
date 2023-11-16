
import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from 'reactstrap'

import { useState, Fragment } from 'react';
import DatePicker from '@components/datepicker/DatePicker';
import TimePicker from '@components/datepicker/TimePicker';
import { useTranslation } from 'react-i18next';

const TestDurationModal = (props) => {

    const { t } = useTranslation()
    const { isOpen, toggleModalState, setTestDuration } = props
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [isOpenModal, setIsOpenModal] = useState(isOpen)


    const setTest = () => {
        let data = {
            startDate,
            endDate,
            startTime,
            endTime
        }
        setTestDuration(data)
    }


    return (
        < Modal className="modal-lg" scrollable isOpen={isOpenModal} toggle={toggleModalState}>
            <ModalHeader toggle={toggleModalState}>{t('Select start and End date of test')} </ModalHeader>
            <ModalBody>

                <Row>
                    <Col md={6}>
                        <DatePicker label={t("Start Date")} value={startDate} onChange={setStartDate} />

                    </Col>
                    <Col md={6}>
                        <TimePicker label={t("Start Time")} value={startTime} onChange={setStartTime} />
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <DatePicker label={t("End Date")} value={endDate} onChange={setEndDate} />
                    </Col>
                    <Col md={6}>
                        <TimePicker label={t("End Time")} value={endTime} onChange={setEndTime} />
                    </Col>
                </Row>

            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={setTest}> {t('Done')} </Button>
            </ModalFooter>
        </Modal >

    )
}
export default TestDurationModal