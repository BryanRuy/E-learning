import React from 'react';

import {
    Row, Col, Card, CardBody, CardTitle, CardHeader
} from 'reactstrap';

import { connect } from 'react-redux'
import { useEffect } from 'react';
import { getAssignmentAttemptDetail, getAssignmentDetail } from '@store/actions';
import { withRouter } from 'react-router-dom';

import '../../assets/scss/custom/components/_card.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import UILoader from '../../@core/components/ui-loader';
import { infoAlertDialog, successAlertDialog, errorAlertDialog } from '../../helpers/HelperFunctions';
import AssignmentDetail from '../assignments/AssignmentDetail';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

const AssignmentAttemptDetail = (props) => {

    const {t} = useTranslation()
    const assignmentAttemptId = props.match.params.assignmentAttemptId;

    const {
        assignmentAttemptDetail,
        assignmentAttemptDetailLoading,
        assignmentAttemptDetailError,
    } = props;



    const getAttemptAndAssignmentDetail = () => {
        props.getAssignmentAttemptDetail(assignmentAttemptId)
    }

    useEffect(getAttemptAndAssignmentDetail, []);

    useEffect(() => {
    }, [assignmentAttemptDetail]);

    return (
        <>
            <UILoader blocking={assignmentAttemptDetailLoading}>
                {
                    assignmentAttemptDetail &&
                    Object.keys(assignmentAttemptDetail).length > 0 && (
                        <Row>
                            <Col lg={12}>
                                <AssignmentDetail
                                    assignment={assignmentAttemptDetail.assignment}
                                    isUpdateMarks={true} />
                            </Col>
                            <Col lg={12}>

                                <Card>
                                    <CardHeader>
                                        <CardTitle tag='h4'>{t('Assignment Content')}</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <ReactMarkdown >{assignmentAttemptDetail.assignment.content}</ReactMarkdown>
                                        <ReactMarkdown >{assignmentAttemptDetail.answerText}</ReactMarkdown>
                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                    )
                }
            </UILoader>
        </>);
};

const mapStateToProps = (state) => {
    const {
        assignmentAttemptDetail,
        assignmentAttemptDetailLoading,
        assignmentAttemptDetailError, } = state.AssignmentAttempts;
    return {

        assignmentAttemptDetail,
        assignmentAttemptDetailLoading,
        assignmentAttemptDetailError,
    };
}

const mapDispatchToProps = {
    getAssignmentAttemptDetail, getAssignmentDetail
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AssignmentAttemptDetail))


