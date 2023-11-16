import React, { useEffect, useState } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col, Button, Table, NavLink
} from 'reactstrap'


import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
    getStudentDetails
} from './store/actions'

import { ChevronDown } from 'react-feather'


import { DateTime } from '../../components/date-time';
import UILoader from '../../@core/components/ui-loader';

import { useParams, Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

import { GET_IMAGE_URL } from '../../helpers/url_helper';
import { useTranslation } from 'react-i18next'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'

const StudentDetails = (props) => {

    const { id } = useParams()
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        props.getStudentDetails(id)
    }, [])


    const handleViewTeacher = (id) => {
        props.history.push('/teachers/' + id)
    }

    return (
        <Fragment >
            <UILoader
                blocking={props.studentLoading}
            >
                <Card>
                    <CardBody >
                        {
                            Object.keys(props.student).length > 0 &&
                            <>
                                <Row className="d-flex align-items-center">
                                    <Col sm='6'>
                                        <h4 className="m-0">
                                            Student Profile
                                        </h4>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col lg='8'>
                                        <div className="shadow-stats-item">
                                            <h5 className="m-0 p-1">
                                                {t('Teachers')}
                                            </h5>
                                            <div>
                                                {
                                                    !props.student.teachers &&
                                                    <div className="text-center p-1">
                                                        {t('No Teacher Found')}
                                                    </div>
                                                }
                                                {
                                                    props.student.teachers &&
                                                    <Table responsive hover >
                                                        <thead>
                                                            <tr>
                                                                <th>{t('Name')}</th>
                                                                <th>{t('Email')}</th>
                                                                <th>{t('Date/Time')}</th>
                                                                <th>{t('Action')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {props.student.teachers.map((t, index) =>
                                                                <tr key={'student' + index} >
                                                                    <td>
                                                                        {t.user.name}
                                                                    </td>
                                                                    <td>
                                                                        {t.user.email}
                                                                    </td>
                                                                    <td><DateTime dateTime={t.createdAt} /></td>
                                                                    <td>
                                                                        <Button.Ripple color='flat-primary'
                                                                            onClick={() => handleViewTeacher(t.user.userId)}
                                                                        >
                                                                            {t('View')}
                                                                        </Button.Ripple>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg='4'>
                                        <div className="shadow-stats-item p-2 d-flex flex-column align-items-center">
                                            <div>
                                                <Avatar
                                                    img={GET_IMAGE_URL(props.student.profilePicture)}
                                                    size={'xl'}
                                                />
                                            </div>
                                            <h5 className="mt-2 mb-0">
                                                {props.student.name}
                                            </h5>
                                            <Link color="primary" to={'#'} >
                                                <small>{props.student.email}</small>
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        }
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        student,
        studentLoading,
        studentError,
    } = state.Students

    return {
        student,
        studentLoading,
        studentError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getStudentDetails
    })(StudentDetails)
)
