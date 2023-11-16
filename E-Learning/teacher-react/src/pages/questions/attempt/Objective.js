import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { IMAGES_BASE_URL } from '../../../helpers/url_helper';
import { CheckCircle, XCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';

export const Objective = (props) => {
    const {t} = useTranslation()
    const {
        question,
        answer,
        number } = props;

    return (
        <Card className="question-test-detail">
            <CardBody>
                <Row>
                    <Col md={question.image ? 8 : 12}>
                        {
                            <h6 className={question.options.filter(x => x.isRight).map(x => x._optionId).indexOf(answer.optionId) >= 0 ? 'right-answer' : 'wrong-answer'}>
                                <i className="times-icon text-danger"><XCircle />&nbsp;&nbsp;&nbsp;</i>
                                <i className="check-icon text-success"><CheckCircle />&nbsp;&nbsp;&nbsp;</i>
                                {`${number}. ${question.text}`}
                            </h6>

                        }


                        {/*--  Options for each question--*/}
                        <ul>
                            {question.options.map((option, index) => (
                                <li
                                    key={`${question}-${option.optionId}`}
                                    className={`card m-0 ${(option._optionId === (answer.optionId || "")) ? 'bg-gradient-primary' : ''}`}
                                >
                                    {option.optionText}
                                </li>
                            ))}
                        </ul>

                    </Col>
                    <Col md={question.image ? 4 : 12} className="text-right">
                        {question.image &&
                            <div>
                                <img src={`${IMAGES_BASE_URL}/${question.image}`} />
                            </div>}
                        <div className="text-right"><p className="text-muted text-right">{t('Marks')}: {question.marks}</p>  </div>

                    </Col>
                </Row>

            </CardBody>
        </Card>
    );
};

Objective.propTypes = {
    question: PropTypes.any.isRequired,
    answer: PropTypes.any.isRequired,
};

export default Objective