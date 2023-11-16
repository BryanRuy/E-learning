import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    Row,
    Col,
} from 'reactstrap';
import { useState, useEffect } from 'react'
import '../../assets/scss/custom/components/_card.scss'
import ViewTest from './ViewTest';
import EditTest from './EditTest';
import { getTestById } from '@store/actions'
import UILoader from '../../@core/components/ui-loader';

const ViewOrEdit = (props) => {

    const { test } = props.location.state;
    const [isView, setIsView] = useState(true)

    const onChangeView = () => {
        setIsView(!isView)
    }

    useEffect(() => {
        props.getTestById(test.testId)
    }, [])

    useEffect(() => { }, [isView])

    useEffect(() => { 
    }, [ props.selectedTest])
  
    return (
        <>
            <UILoader blocking={props.selectedTestLoading}>
                {
                    props.selectedTest &&
                    props.selectedTest.testId && (
                        isView ?
                            <ViewTest test={props.selectedTest} onChangeView={onChangeView} />
                            : <EditTest test={props.selectedTest} onChangeView={onChangeView} />
                    )
                }
            </UILoader>
        </>);
};


const mapStateToProps = (state) => {
    const { selectedTest, selectedTestLoading, selectedTestError } = state.Tests;
    return { selectedTest, selectedTestLoading, selectedTestError };
}

const mapDispatchToProps = {
    getTestById
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewOrEdit))