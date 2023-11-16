
import React from 'react';
import Objective from './Objective';
import Subjective from './Subjective';

export const Questions = props => {
    const { question,
        answer,
        number,
        updateQuestions
    } = props;

    return (
        <>  {
            question.type === 1 ?
                <Objective
                    question={question}
                    answer={answer}
                    number={number} />
                :
                <Subjective question={question}
                    answer={answer}
                    number={number}
                    updateQuestions={updateQuestions} />
        }

        </>
    )
}

export default Questions