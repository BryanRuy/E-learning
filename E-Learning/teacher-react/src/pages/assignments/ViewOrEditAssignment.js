import React from 'react';

import {
    Row,
    Col,
} from 'reactstrap';
import { useState, useEffect } from 'react'
import '../../assets/scss/custom/components/_card.scss'
import ViewAssignment from './ViewAssignment';
import EditAssignment from './EditAssignment';



const ViewOrEditAssignment = (props) => {

    const { assignment } = props.location.state;
    const [isView, setIsView] = useState(true)

    const onChangeView = () => {
        setIsView(!isView)
    }

    useEffect(() => { }, [isView])

    return (
        <>
            {
                assignment && (
                    isView ?
                        <ViewAssignment assignment={assignment} onChangeView={onChangeView} />
                        : <EditAssignment assignment={assignment} onChangeView={onChangeView} />
                )
            }

        </>);
};

export default ViewOrEditAssignment


