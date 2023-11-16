
import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, Table
} from 'reactstrap'

import Avatar from '@components/avatar'
import { DateTime } from '../../components/date-time';
import { getProfileImageUrl } from '../../helpers/url_helper'
import { useTranslation } from 'react-i18next';
const StudentListModal = (props) => {

    const {t} = useTranslation()
     const { students, isOpen, toggleModalState, onSelectedStudent } = props


    return (
        < Modal className="modal-lg" scrollable isOpen={isOpen} toggle={toggleModalState}>
            <ModalHeader toggle={toggleModalState}>{t('Assign test to student')}</ModalHeader>
            <ModalBody>

                <Table responsive >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('Name')}</th>
                            <th>{t('Email')}</th>
                            <th>{t('Created At')}</th>
                            <th>{t('Action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students && students.map((s, i) =>
                            <tr key={`student-list-${s.user.userId}`} >
                                <td>{i + 1}</td>
                                <td >
                                    <Avatar
                                        className='cursor-pointer'
                                        img={getProfileImageUrl(s.user.profilePicture)}
                                    />
                                    <span className='align-middle font-weight-bold ml-1'>
                                        {s.user.name}
                                    </span>
                                </td>
                                <td>{s.user.email}</td>
                                <td><DateTime dateTime={s.user.createdAt} type="date" /></td>

                                <td>
                                    <Button.Ripple color='flat-primary' onClick={e => { e.preventDefault(); onSelectedStudent(s) }}>
                                        {t('Assign')}
                                    </Button.Ripple>
                                </td>


                            </tr>
                        )}
                    </tbody>
                </Table>

            </ModalBody>
        </Modal >

    )
}
export default StudentListModal