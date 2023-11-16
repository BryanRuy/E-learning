import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import {
    Card, CardBody, Row, Col,
    Button,
    Table,
} from 'reactstrap'

// ** Store & Actions
import { connect, useSelector } from 'react-redux'
import { getNewAssignments, getPastAssignments, selectAssignment } from './store/actions'

import { withRouter, } from 'react-router';

import UILoader from '../../@core/components/ui-loader';

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { DateTime } from '../../components/date-time';
import './style.scss'

import moment from 'moment'

import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AssignmentList from './assignment-list';
import { useTranslation } from 'react-i18next';


const MySwal = withReactContent(Swal)


const AppAssignments = (props) => {

    const { t } = useTranslation()
    const [newAssignmentData, setNewAssignmentData] = useState()
    const [pastAssignmentData, setPastAssignmentData] = useState()

    useEffect(() => {
        if (props.newAssignments) setNewAssignmentData(props.newAssignments.data)
    }, [props.newAssignments])

    useEffect(() => {
        if (props.pastAssignments) setPastAssignmentData(props.pastAssignments.data)
    }, [props.pastAssignments])

    useEffect(() => {
        let data = { "page": 1, "limit": 20 }
        props.getNewAssignments(data);
        props.getPastAssignments(data);
    }, [])

    const goToNewAssignmentList = () => {
        props.history.push("/new-assignments")
    }

    const goToPastAssignmentList = () => {
        props.history.push("/past-assignments")
    }

    const viewAssignmentDetail = (a) => {
        props.selectAssignment(a)
        props.history.push(`/assignments/details`)
    }

    // const handleAssignmentAttempt = (a) => {
    //     if (moment().isAfter(moment(a.startDate))
    //         || moment().isSame(moment(a.startDate))
    //         || moment().isBefore(moment(a.endDate))
    //         || moment().isSame(moment(a.endDate))
    //     ) {
    //         return MySwal.fire({
    //             icon: 'question',
    //             title: "Confirm",
    //             text: 'Are you sure you want to start the assignment?',
    //             customClass: {
    //                 confirmButton: 'btn btn-primary',
    //                 cancelButton: 'btn btn-outline-danger ml-1'
    //             },
    //             showCancelButton: true,
    //             confirmButtonText: 'Yes',
    //             buttonsStyling: false
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 goToAssignment(a)
    //             }
    //         })
    //     }
    // }

    return (
        <Fragment >
            <UILoader
                blocking={props.newAssignmentsLoading || props.pastAssignmentsLoading}
                className="w-100 h-100">
                <Row>
                    <Col lg='12'>
                        <Card className="m-1">
                            <CardBody >
                                <Row>
                                    <Col sm='12'>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 >
                                               {t('New Assignments')}
                                            </h5>
                                            <Button.Ripple color='flat-primary'
                                                onClick={() => goToNewAssignmentList()}
                                            >
                                                {t('View All')}
                                            </Button.Ripple>
                                        </div>
                                    </Col>
                                    <Col sm='12' className="mt-2">
                                        {
                                            !props.newAssignmentsLoading &&
                                            props.newAssignmentsError &&
                                            <NoNetwork />
                                        }
                                        {
                                            !props.newAssignmentsLoading &&
                                            !props.newAssignmentsError &&
                                            newAssignmentData &&
                                            newAssignmentData.length == 0 &&
                                            <NotFound />
                                        }
                                        {
                                            !props.newAssignmentsLoading &&
                                            !props.newAssignmentsError &&
                                            newAssignmentData &&
                                            newAssignmentData.length > 0 &&

                                            <AssignmentList
                                                assignmentList={newAssignmentData}
                                                startAssignment={viewAssignmentDetail}
                                                isPagination={false}
                                                isNew={true}
                                                count={6}
                                                limit={5}
                                            />
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg='12' className="mt-1">
                        <Card className="m-1">
                            <CardBody >
                                <Row >
                                    <Col sm='12'>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5 >
                                               {t('Past Assignments')}
                                            </h5>
                                            <Button.Ripple color='flat-primary'
                                                onClick={() => goToPastAssignmentList()}
                                            >
                                                {t('View All')}
                                            </Button.Ripple>
                                        </div>
                                    </Col>
                                    <Col sm='12 mt-2'>
                                        {
                                            !props.pastAssignmentsLoading &&
                                            props.pastAssignmentsError &&
                                            <NoNetwork />
                                        }
                                        {
                                            !props.pastAssignmentsLoading &&
                                            !props.pastAssignmentsError &&
                                            pastAssignmentData &&
                                            pastAssignmentData.length == 0 &&
                                            <NotFound />
                                        }
                                        {
                                            !props.pastAssignmentsLoading &&
                                            !props.pastAssignmentsError &&
                                            pastAssignmentData &&
                                            pastAssignmentData.length > 0 &&

                                            <AssignmentList
                                                assignmentList={pastAssignmentData}
                                                startAssignment={viewAssignmentDetail}
                                                isPagination={false}
                                                isNew={false}
                                                count={1}
                                                limit={5}
                                            />
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        newAssignmentList,
        newAssignments,
        newAssignmentsLoading,
        newAssignmentsError,

        pastAssignmentList,
        pastAssignments,
        pastAssignmentsLoading,
        pastAssignmentsError,
    } = state.Assignments;
    return {
        newAssignmentList,
        newAssignments,
        newAssignmentsLoading,
        newAssignmentsError,

        pastAssignmentList,
        pastAssignments,
        pastAssignmentsLoading,
        pastAssignmentsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getNewAssignments, getPastAssignments, selectAssignment
    })(AppAssignments)
)
