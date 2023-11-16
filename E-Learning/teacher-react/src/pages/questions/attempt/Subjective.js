import React from 'react';
import {
    Card, CardBody, Row, Col, Form,
    Label, Input, FormGroup,
} from 'reactstrap';
import { IMAGES_BASE_URL } from '../../../helpers/url_helper';
import { useState } from 'react';

import '../../../assets/scss/custom/components/_question.scss'
import { infoAlertDialog } from '../../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';

export const Subjective = (props) => {

    const {t}= useTranslation()
    const { question, updateQuestions } = props

    const number = props.number || '';
    const answer = props.answer || '';
    let obtMarks = answer.obtainedMarks || 0
    const [obtainedMarks, setObtainedMarks] = useState(obtMarks)

    const onUpdateQuestionMarks = (e) => {
        if (question.marks >= Number(e.target.value)) {
            setObtainedMarks(Number(e.target.value))
            let data = {
                questionId: answer.questionId,
                attemptId: answer.attemptId,
                obtainedMarks: Number(e.target.value)
            }
            updateQuestions(data)
        } else {
            infoAlertDialog(`${t("Obtained marks cannot be greater than total marks")}`)
        }
    }

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
                        <FormGroup className={question.image ? 'attempt-obtained-marks-with-image' : ''}>
                            <Label for='obtained-marks'>{t('Enter Obtained Marks')}</Label>
                            <Input id='obtained-marks' value={obtainedMarks} onChange={e => onUpdateQuestionMarks(e)} />
                        </FormGroup>

                    </Col>

                    <Col md={question.image ? 4 : 12}>
                        {
                            question.image &&
                            <div className="text-right">
                                <img src={`${IMAGES_BASE_URL}/${question.image}`} />
                            </div>
                        }
                        <div className="text-right"><p className="text-muted text-right">{t('Marks')}: {question.marks}</p></div>

                    </Col>
                </Row>



            </CardBody>
        </Card>
    );
};

// Subjective.propTypes = {
//     question: PropTypes.any.isRequired,
//     answer: PropTypes.any.isRequired,
// };

export default Subjective