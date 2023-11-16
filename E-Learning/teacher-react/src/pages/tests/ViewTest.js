import React from 'react';

import {
    Row,
    Col,
} from 'reactstrap';
import ViewQuestions from '../questions/view/Question'
import TestDetail from '../tests/TestDetail'
import '../../assets/scss/custom/components/_card.scss'


const ViewTest = (props) => {


    const { test, onChangeView } = props

    return (
        <>
            {
                test && (
                    <Row>
                        <Col lg={12}>
                            <TestDetail
                                test={test}
                                isEdit={true}
                                onChangeView={onChangeView} />
                        </Col>
                        {
                            test.questions.map(
                                (q, index) => (
                                    <Col
                                        lg={12}
                                        key={`question-${index + 1}`}>
                                        <ViewQuestions
                                            question={q}
                                            number={index + 1}
                                        />
                                    </Col>
                                )
                            )
                        }
                    </Row>
                )
            }
        </>);
};

export default ViewTest


