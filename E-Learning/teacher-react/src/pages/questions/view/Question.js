
import React from 'react';
import Objective from './Objective';
import Subjective from './Subjective';

export const Questions = props => {

    const {
        question,
        number
    } = props;

    return (
        <>  {
            question.type === 1 ?
                <Objective
                    question={question}
                    number={number} />
                :
                <Subjective
                    question={question}
                    number={number} />

        }

        </>
    )
}

export default Questions