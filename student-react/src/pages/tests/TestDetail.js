import React from 'react';
import {
    CardBody, Card, Button, Row, Col, CardText
} from 'reactstrap';
import { DateTime } from '../../components/date-time';
import PropTypes from 'prop-types';
import { ArrowLeft, Edit } from 'react-feather'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const TestDetail = (props) => {

    const { t } = useTranslation()
    const { test, obtainedMarks, totalMarks } = props;

    return (
        <>
            {
                Object.keys(test).length > 0 && (
                    <div>
                        <Row className="mb-2">
                            <Col md="6">
                                <Button.Ripple
                                    className="btn-icon"
                                    size="sm"
                                    onClick={() => props.history.goBack()}
                                >
                                    <ArrowLeft size={16} />
                                </Button.Ripple>
                                <h3 className='ml-2 d-inline m-0'>{t('Test')}</h3>
                            </Col>
                        </Row>
                        <Card>
                            <CardBody>
                                <Row >
                                    <Col>
                                        <div className='user-avatar-section'>
                                            <div className='d-flex justify-content-start'>
                                                <div className='d-flex flex-column'>
                                                    <div className='user-info '>
                                                        <h4 className=''>{test.title}</h4>
                                                        <Row>
                                                            <CardText tag='span' className='ml-1'>
                                                                {t('Created At')}: <strong>{<DateTime dateTime={test.createdAt} type="datetime" />}</strong>
                                                            </CardText>
                                                        </Row>
                                                        <Row>
                                                            <CardText tag='span' className='ml-1'>
                                                                {t('Duration')}: <strong>{test.timeLimit / 60} mins</strong>
                                                            </CardText>
                                                        </Row>
                                                        <Row>
                                                            <CardText tag='span' className='ml-1'>
                                                                {t('Marks')}: <strong>{obtainedMarks}/ {totalMarks} </strong>
                                                            </CardText>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                )}
        </>
    );
};


TestDetail.propTypes = {
    test: PropTypes.object.isRequired,
    obtainedMarks: PropTypes.object.isRequired,
    totalMarks: PropTypes.object.isRequired,
    onBack: PropTypes.func
}


export default withRouter(connect()(TestDetail))




