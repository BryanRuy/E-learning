import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components

import {
    Card, CardBody, Row, Col,
    Button,
} from 'reactstrap'
import { useTranslation } from 'react-i18next';

// ** Store & Actions
import { connect } from 'react-redux'
import { getNewAssignments, selectAssignment } from './store/actions'
import { withRouter } from 'react-router';
import UILoader from '../../@core/components/ui-loader';
import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { DateTime } from '../../components/date-time';

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'

import moment from 'moment'

import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AssignmentList from './assignment-list';

const MySwal = withReactContent(Swal)

const NewAssignments = (props) => {

    const { t } = useTranslation()
    const [newAssignmentData, setNewAssignmentData] = useState()

    useEffect(() => {
        if (props.newAssignments) setNewAssignmentData(props.newAssignments.data)
    }, [props.newAssignments])

    // ** Function to handle Pagination
    const onSelectPage = (index) => {
        let data = {
            "page": index,
            "limit": 20
        }
        if (props.newAssignmentList && props.newAssignmentList[index]) setNewAssignmentData(props.newAssignmentList[index])
        else props.getNewAssignments(data)
    }

   

    useEffect(() => {
        if (props.newAssignments && props.newAssignments.data.length == 0) {
            props.getNewAssignments()
        }
    }, [])


    const goToAssignment = (a) => {
        props.selectAssignment(a)
        props.history.push(`/assignments/details`)
    }

    const startAssignmentAttempt = (a) => {
        if (moment().isAfter(moment(a.startDate))
            || moment().isSame(moment(a.startDate))
            || moment().isBefore(moment(a.endDate))
            || moment().isSame(moment(a.endDate))
        ) {
            return MySwal.fire({
                icon: 'question',
                title: t("Confirm"),
                text: t('Are you sure you want to start the assignment?'),
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-danger ml-1'
                },
                showCancelButton: true,
                confirmButtonText: 'Yes',
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    goToAssignment(a)
                }
            })
        }
    }

    const columns = [
        {
            name: 'Title',
            sortable: true,
            minWidth: '250px',
            cell: row => {
                return (
                    <>
                        {
                            row.assignment.title
                        }
                    </>
                )
            }
        },
        {
            name: 'Start Date',
            sortable: false,
            minWidth: '100px',
            cell: row => {
                return (
                    <>
                        <DateTime dateTime={row.startDate} type="date" />
                    </>
                )
            }
        },
        {
            name: 'Due Date',
            sortable: false,
            minWidth: '100px',
            cell: row => {
                return (
                    <>
                        <DateTime dateTime={row.endDate} type="date" />
                    </>
                )
            }
        },
        {
            name: 'Action',
            minWidth: '250px',
            cell: a => {
                return (
                    <>
                        {
                            (
                                moment().isAfter(moment(a.startDate))
                                || moment().isSame(moment(a.startDate))
                                || moment().isBefore(moment(a.endDate))
                                || moment().isSame(moment(a.endDate))
                            ) &&
                            <Button.Ripple color='flat-primary'
                                onClick={() => startAssignmentAttempt(a)} >
                                Start
                            </Button.Ripple>
                        }
                    </>
                )
            }
        },
    ]


    return (
        <Fragment >
            <UILoader
                blocking={props.newAssignmentsLoading}
                className="w-100">
                <Card >
                    <CardBody >
                        <Row >
                            <Col sm='12'>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 >
                                        {t('New Assignments')}
                                    </h5>
                                </div>
                            </Col>
                            <Col sm='12 mt-2'>
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
                                        startAssignment={startAssignmentAttempt}
                                        onSelectPage={onSelectPage}
                                        isPagination={true}
                                        isNew={true}
                                        count={props.newAssignments.count}
                                        limit={newAssignmentData.length}
                                    />
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
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
    } = state.Assignments;
    return {
        newAssignmentList,
        newAssignments,
        newAssignmentsLoading,
        newAssignmentsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getNewAssignments, selectAssignment
    })(NewAssignments)
)
