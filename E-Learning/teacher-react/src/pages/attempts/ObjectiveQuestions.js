import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { BASE_URL } from '../../helpers/url_helper';

export const ObjectiveQuestion = (props) => {
    const question = props.question;
    const number = props.number || '';
    return (
        <Card className="question-test-detail">
            <CardBody>
                <p className="text-muted">Marks: {question.marks}</p>
                {question.image && <img src={`${BASE_URL}/${question.image}`} />}
                <h6 className={question.options.filter(x => x.isRight).map(x => x.optionId).indexOf(props.answer.optionId) >= 0 ? 'right-answer' : 'wrong-answer'}>
                    <i className="times-icon text-danger"><i className="fa fa-times"></i>&nbsp;&nbsp;&nbsp;</i>
                    <i className="check-icon text-success"><i className="fa fa-check"></i>&nbsp;&nbsp;&nbsp;</i>
                    {`${number}. ${question.text}`}
                </h6>
                {/*--  Options for each question--*/}
                <ul>
                    {question.options.map((option, index) => (
                        <li
                            key={`${question}-${option.optionId}`}
                            className={(option.optionId === (props.answer.optionId || "")) ? 'selected-option' : ''}
                        >
                            {option.optionText}
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
};

ObjectiveQuestion.propTypes = {
    question: PropTypes.any.isRequired,
    answer: PropTypes.any.isRequired,
};

export default ObjectiveQuestion