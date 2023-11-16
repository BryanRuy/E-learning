import React from 'react';
import {
    Row,
    Col,
} from 'reactstrap';

import TestDetail from './TestDetail';
import TestsTabContainer from './TestTabContainer';


const AssignTestHome = (props) => {

   
    const { test } = props.location.state;

    return (
        <>
            {
                Object.keys(test).length > 0 && (
                    <Row>
                        <Col lg={12}>
                            <TestDetail test={test} />
                        </Col>

                        <Col lg={12}>
                            <TestsTabContainer test={test} />
                        </Col>
                    </Row>
                )
            }
        </>
    );
};


export default AssignTestHome


