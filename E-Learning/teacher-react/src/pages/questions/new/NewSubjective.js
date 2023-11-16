
import React from 'react';
import {
    Card, CardBody, Row, Col
} from 'reactstrap';
import { AvField } from 'availity-reactstrap-validation';
import QuestionFooter from './QuestionFooter';
import QuestionImageFile from './QuestionImageFile';


const NewSubjective = (props) => {
    const { question, index } = props

    const updateQuestion = (index, deleteCount, newItem = undefined) => {
        props.onChangeQuestion(index, deleteCount, newItem)
    }

    const addNewQuestion = type => {
        props.onAddQuestion(type, index)
    }

    const onRemoveQuestion = () => {
        props.onRemoveQuestion(index)
    }

    const onFileChanged = e => {
        props.onFileChanged(e, index)
    }

    const onChangeQuestionText = e => {
        let text = e.target.value;
        question.text = text;
        updateQuestion(index - 1, 1, question);
    }

    const onMarksChange = e => {
        let text = e.target.value;
        question.marks = text;
        updateQuestion(index - 1, 1, question);
    }

    return (
        <Card className="question-control">
            <CardBody>
                <Row>
                    <Col sm={12}>
                        <div className='mb-3'>
                            <AvField
                                name={`question-${index}`}
                                label={`${index + 1}. Question`}
                                value={`${question.text}`}
                                className='form-control'
                                placeholder="Enter question statement"
                                onChange={e => onChangeQuestionText(e, index)}
                                type='text'
                                required
                            />
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Col lg={6}>
                        <QuestionImageFile
                            htmlId={`file-${index}`}
                            htmlName={`question-${index}`}
                            label={`Image`}
                            question={question}
                            onFileChanged={onFileChanged}
                        />
                    </Col>
                </Row>
                <hr />

                <QuestionFooter
                    index={index}
                    question={question}
                    onMarksChange={onMarksChange}
                    onNewQuestion={addNewQuestion}
                    onRemoveQuestion={onRemoveQuestion} />

            </CardBody>
        </Card>
    )
}

export default NewSubjective