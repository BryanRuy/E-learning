import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Col, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle
} from 'reactstrap';
import Question from '../questions/new/Question';

const Questions = (props) => {

    const {t} = useTranslation()
    const { questions, isEdit } = props

    const objectiveQuestion = {
        "file": null,
        "text": "",
        "marks": 10,
        "type": 1,
        "options": [
            {
                "optionText": "",
                "isRight": false
            },
            {
                "optionText": "",
                "isRight": false
            }]
    }

    const subjectiveQuestion = {
        "file": null,
        "text": "",
        "marks": 10,
        "type": 2
    }

    const updateQuestions = (index, deleteCount, newItem = undefined) => {
        props.onChangeQuestion(index, deleteCount, newItem)
    }

    const addQuestion = (type, index) => {
        const newQuestion = type == 1 ? objectiveQuestion : subjectiveQuestion
        updateQuestions(index, 0, JSON.parse(JSON.stringify(newQuestion)))
    }

    const onRemoveQuestion = (questionIndex) => {
        if (questions.length > 0) {
            updateQuestions(questionIndex, 1)
        }
    }

    const onFileChanged = (file, index) => {
        props.onFileChanged(file, index)
    }

    return (
        <>
            {
                (!questions || questions.length <= 0) &&
                <Col lg={12}>
                    <div className='demo-inline-spacing'>
                        <UncontrolledButtonDropdown>
                            <DropdownToggle color='success' outline caret>
                                {t('Add New Question')}
                            </DropdownToggle>
                            <DropdownMenu >
                                <DropdownItem onClick={() => { addQuestion(1, 0) }}>{t('Objective Question')}</DropdownItem>
                                <DropdownItem onClick={() => { addQuestion(2, 0) }}>{t('Subjective Question')}</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </div>
                </Col>
            }

            {

                questions && questions.length > 0 &&
                questions.map((question, index) =>
                    <Question
                        key={`question-${index}`}
                        question={question}
                        index={index}
                        onAddQuestion={addQuestion}
                        onRemoveQuestion={onRemoveQuestion}
                        onChangeQuestion={updateQuestions}
                        onFileChanged={onFileChanged}
                        isEdit={isEdit}
                    />
                )
            }
        </>
    )
}

export default Questions