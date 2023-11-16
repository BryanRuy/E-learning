import React from 'react';

import {
    Row,
    Col,
    Card, CardBody, CardTitle, CardHeader
} from 'reactstrap';
import '../../assets/scss/custom/components/_card.scss'
import AssignmentDetail from './AssignmentDetail';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';


const ViewAssignment = (props) => {

    const {t} = useTranslation()
    const { assignment, onChangeView } = props
    return (
        <>
            {
                assignment && (
                    <Row>
                        <Col lg={12}>
                            <AssignmentDetail
                                assignment={assignment}
                                isEdit={true}
                                onChangeView={onChangeView} />
                        </Col>
                        <Col lg={12}>

                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h4'>{t('Assignment Content')}</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <ReactMarkdown >{assignment.content}</ReactMarkdown>
                                </CardBody>
                            </Card>
                        </Col>


                    </Row>
                )
            }
        </>);
};

export default ViewAssignment


