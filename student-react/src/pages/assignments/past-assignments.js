import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components

import {
    Card, CardBody, Row, Col,
} from 'reactstrap'
import { useTranslation } from 'react-i18next';

// ** Store & Actions
import { connect } from 'react-redux'
import { getPastAssignments, selectAssignment } from './store/actions'

import { withRouter } from 'react-router';

import UILoader from '../../@core/components/ui-loader';

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'
import AssignmentList from './assignment-list';

const PastAssignments = (props) => {

    const { t } = useTranslation()
    const [pastAssignmentData, setPastAssignmentData] = useState()

    useEffect(() => {
        if (props.pastAssignments) setPastAssignmentData(props.pastAssignments.data)
    }, [props.pastAssignments])

    // ** Function to handle Pagination
    const onSelectPage = (index) => {
        let data = {
            "page": index,
            "limit": 20
        }
        if (props.pastAssignmentList && props.pastAssignmentList[index]) setPastAssignmentData(props.pastAssignmentList[index])
        else props.getPastAssignments(data)

    }

    useEffect(() => {

        props.getPastAssignments({
            "page": 1,
            "limit": 20
        })

    }, [])


    const assignmentDetail = (a) => {
        props.selectAssignment(a)
        props.history.push(`/assignments/details`)
    }


    return (
        <Fragment >
            <UILoader
                blocking={props.pastAssignmentsLoading}
                className="w-100">
                <Card >
                    <CardBody >
                        <Row >
                            <Col sm='12'>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h5 >
                                        {t('Past Assignments')}
                                    </h5>
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
                                        startAssignment={assignmentDetail}
                                        onSelectPage={onSelectPage}
                                        isPagination={true}
                                        isNew={false}
                                        count={props.pastAssignments.count}
                                        limit={pastAssignmentData.length}
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
        pastAssignmentList,
        pastAssignments,
        pastAssignmentsLoading,
        pastAssignmentsError,
    } = state.Assignments;
    return {
        pastAssignmentList,
        pastAssignments,
        pastAssignmentsLoading,
        pastAssignmentsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getPastAssignments, selectAssignment
    })(PastAssignments)
)
