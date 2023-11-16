import React from 'react';
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';
import { DOCUMENT_BASE_URL } from '../../helpers/url_helper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Subjective = (props) => {

    const { question } = props
    const { t } = useTranslation()
    const number = props.number || '';
    const answer = props.answer || '';
    let obtMarks = answer.obtainedMarks || 0
    const [obtainedMarks, setObtainedMarks] = useState(obtMarks)



    return (
        <Card className="question-test-detail">
            <CardBody>

                <Row>
                    <Col md={question.image ? 8 : 12}>

                        <h5 >
                            {`${number}. ${question.text}`}
                        </h5>
                        {/*-- answer of the question--*/}
                        <h7>
                            {answer.answerText}
                        </h7>
                    </Col>

                    <Col md={question.image ? 4 : 12}>
                        {
                            question.image &&
                            <div className="text-right">
                                <img src={`${DOCUMENT_BASE_URL}/${question.image}`} />
                            </div>
                        }
                        <div className="text-right">
                            <p className="text-muted text-right">{t('Marks')}: {question.marks}</p>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default Subjective