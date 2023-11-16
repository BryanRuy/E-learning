import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { IMAGES_BASE_URL } from '../../../helpers/url_helper';
import { useTranslation } from 'react-i18next';
export const Objective = (props) => {
    const {t} = useTranslation()
    const {
        question,
        number } = props;

    return (
        <Card className="question-test-detail">
            <CardBody>
                <Row>
                    <Col>
                        <h6 >
                            {`${number}. ${question.text}`}
                        </h6>
                        <p className="text-muted">{t('Marks')}: {question.marks}</p>
                    </Col>
                </Row>

                <Row>
                    <Col md={question.image ? 8 : 12}>
                        {/*--  Options for each question--*/}
                        <ul>
                            {question.options.map((option, index) => (
                                <li
                                    key={`${question}-${option.optionId}`}
                                    className={`card m-0 ${option.isRight ? 'bg-gradient-primary' : ''}`}
                                >
                                    {option.optionText}
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col md={4}>
                        {question.image &&
                            <div className="text-right">
                                <img src={`${IMAGES_BASE_URL}/${question.image}`} />
                            </div>}

                    </Col>
                </Row>



            </CardBody>
        </Card>
    );
};

Objective.propTypes = {
    question: PropTypes.any.isRequired
};

export default Objective