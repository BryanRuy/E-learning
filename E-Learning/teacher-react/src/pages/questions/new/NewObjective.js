import React from 'react';
import { useState } from 'react'
import {
    Card, CardBody, Row, Col, Button,
} from 'reactstrap';
import { Plus, Trash } from 'react-feather'
import { AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import QuestionFooter from './QuestionFooter';
import QuestionImageFile from './QuestionImageFile';
import { useTranslation } from 'react-i18next';

const NewObjective = (props) => {
    const {t} =  useTranslation()
    let selectedOptionId = null
    const { question, index, isEdit } = props

    if (question.options) {
        let selectedOptionIndex = question.options.findIndex(opt => opt.isRight)
        selectedOptionId = selectedOptionIndex > -1 ? selectedOptionIndex : null;
    }

    const [selectedOption, setSelectedOption] = useState(String(selectedOptionId))

    const updateQuestions = (index, deleteCount, newItem = undefined) => {
        props.onChangeQuestion(index, deleteCount, newItem)
    }

    const addNewQuestion = (type) => {
        props.onAddQuestion(type, index)
    }

    const onRemoveQuestion = () => {
        props.onRemoveQuestion(index)
    }

    const onFileChanged = file => {
        props.onFileChanged(file, index)
    }


    const onChangeQuestionText = e => {
        let text = e.target.value;
        question.text = text;
        updateQuestions(index - 1, 1, question);
    }

    const onMarksChange = val => {
        question.marks = val;
        updateQuestions(index - 1, 1, question);
    }

    const onNewOption = () => {
        question.options.push({ optionText: "", isRight: 0 });
        updateQuestions(index - 1, 1, question);
    }

    const onChangeOptionRadio = (optionIndex) => {
        question.options.forEach(e => e.isRight = false)
        question.options[optionIndex].isRight = true;
        setSelectedOption(optionIndex)
        updateQuestions(index - 1, 1, question);
    }

    const onChangeOptionText = (e, optionIndex) => {
        let text = e.target.value;
        question.options[optionIndex].optionText = text;
        updateQuestions(index - 1, 1, question);
    }

    const onRemoveOption = (optionIndex) => {
        if (question.options.length > 2) {
            question.options.splice(optionIndex, 1);
            updateQuestions(index - 1, 1, question);
        }
    }

    return (
        <Card className="question-control">
            <CardBody>
                <Row>
                    <Col sm={12}>
                        <div className='mb-3'>
                            <AvField
                                name={`question${index}`}
                                label={`${index + 1}. Question`}
                                value={`${question.text}`}
                                className='form-control'
                                placeholder={
                                    t('Enter question statement')
                                }
                                onChange={e => onChangeQuestionText(e)}
                                type='text'
                                required
                            />

                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={6}>
                        <AvRadioGroup name={`question${index}radio`} label="" required
                            errorMessage={t("Atleast one must be selected")}
                            value={String(selectedOption)}>
                            {question.options.map((option, optionIndex) =>
                                <div className='mb-2 single-option'>
                                    <Row>
                                        <Col sm={1}>
                                            <AvRadio
                                                customInput
                                                onClick={() => onChangeOptionRadio(optionIndex)}
                                                className="option-radio" label="" value={String(optionIndex)} />
                                        </Col>
                                        <Col sm={8}>
                                            <input
                                                name={`question${index}option${optionIndex}`}
                                                value={`${option.optionText}`}
                                                onChange={e => onChangeOptionText(e, optionIndex)}
                                                className='form-control option-text'
                                                placeholder={
                                                    `${t('Enter Option')} ${optionIndex + 1}`
                                                }
                                                type='text'
                                                required
                                            />
                                        </Col>
                                        <Col sm={3}>
                                            <Button.Ripple
                                                onClick={() => onNewOption()}
                                                className='btn-icon float-right' size="sm" color='success' outline >
                                                <Plus size={14} />
                                            </Button.Ripple>
                                            {
                                                !isEdit &&
                                                <Button.Ripple
                                                    onClick={() => onRemoveOption(optionIndex)}
                                                    className='btn-icon float-right mr-1' size="sm" color='danger' outline >
                                                    <Trash size={14} />
                                                </Button.Ripple>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </AvRadioGroup>
                        <div>
                            <Row>
                                <Col sm={12}>

                                    <QuestionImageFile
                                        htmlId={`file-${index}`}
                                        htmlName={`question-${index}`}
                                        label={`Image`}
                                        question={question}
                                        onFileChanged={onFileChanged}
                                    />
                                </Col>
                            </Row>
                        </div>
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
        </Card >
    )
}

export default NewObjective