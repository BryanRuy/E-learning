import React from 'react'

import { Col } from 'reactstrap';
import NewObjective from './NewObjective';
import NewSubjective from './NewSubjective';

export default function Question(props) {
    const {
        index,
        question,
        onAddQuestion,
        onRemoveQuestion,
        onChangeQuestion,
        onFileChanged,
        isEdit
    } = props;

    return (
        <Col lg={12}>
            {
                question.type == 1
                &&
                <NewObjective
                    key={`objective-${index}`}
                    question={question}
                    index={index}
                    onAddQuestion={onAddQuestion}
                    onRemoveQuestion={onRemoveQuestion}
                    onChangeQuestion={onChangeQuestion}
                    onFileChanged={onFileChanged}
                    isEdit={isEdit}
                />
            }

            {
                question.type == 2
                &&
                <NewSubjective
                    key={`subjective-${index}`}
                    question={question}
                    index={index}
                    onAddQuestion={onAddQuestion}
                    onRemoveQuestion={onRemoveQuestion}
                    onChangeQuestion={onChangeQuestion}
                    onFileChanged={onFileChanged}
                />
            }
        </Col>
    )
}
