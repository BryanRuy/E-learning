import React, { useEffect, useState } from 'react';
// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col,Label,Input,Button
} from 'reactstrap'


import { RefreshCcw } from 'react-feather';
// ** Store & Actions
import { connect } from 'react-redux'

import { withRouter } from 'react-router';
import {
    getStudentNewOrWaitingStatus,onSearchChange
} from './store/actions'


import UILoader from '../../@core/components/ui-loader';

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import './style.scss'

import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import StudentList from './student-list';
import { useTranslation } from 'react-i18next'
import CustomPagination from '../pagination';
import { RefreshCw } from 'react-feather';
const NewStudentsOrWaitingForTeachers = (props) => {

    const [searchValue, setSearchValue] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [studentList, setStudentList] = useState([])
    const { t } = useTranslation();
    const { waitingOrNewStudentsListData,
        waitingOrNewStudents,
        waitingOrNewStudentsLoading,
        waitingOrNewStudentsError, } = props

    const fetchStudentList = (page) => {
        let data = { page: page, limit: 20 ,search:searchValue}
        props.getStudentNewOrWaitingStatus(data)
    }

    useEffect(() => {
        fetchStudentList(currentPage)
    }, [])

    useEffect(() =>{
        props.onSearchChange()
    },[searchValue])

    useEffect(() => {
        if (waitingOrNewStudents && waitingOrNewStudents.data) setStudentList(waitingOrNewStudents.data)
    }, [waitingOrNewStudents])

    const handleViewStudent = (student) => {
        props.history.push({
            pathname:`/student-history/${student.userId}`,
            state:{user:student}
        })
    }

    const onSelect = (student) => {
        props.history.push({
            pathname: `/assign-unassign-teacher`,
            state: { user: student, isTeacher: true }
        })
    }

    const onSelectPage = (page) => {
        if (waitingOrNewStudentsListData[page]) setStudentList(waitingOrNewStudentsListData[page])
        else fetchStudentList(page)
        setCurrentPage(page)
    }

    const searchStudentByName = () => {
        fetchStudentList(1)
    }
   

    return (
        <Fragment >
            <UILoader
                blocking={waitingOrNewStudentsLoading}>
                <Card>
                    <CardBody >
                        <Row className="d-flex align-items-center">
                            <Col sm='6'>
                                <h4 className="m-0">
                                    {t(`${t('New')} ${t('or')} ${t('Waiting for teachers')}`)}
                                </h4>
                            </Col>
                        </Row>

                        <Row className=' mx-0 mt-1 mb-50'>
                            <Col className=' d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='12'>
                                <Label className='mr-1' for='search-input'>
                                    {t('Search')}
                                </Label>
                                <Input
                                    className='dataTable-filter'
                                    type='text'
                                    bsSize='sm'
                                    id='search-input'
                                    value={searchValue}
                                    onChange={e => { setSearchValue(e.target.value) }}
                                />
                                <Button.Ripple className="btn-icon ml-1" size="sm" onClick={searchStudentByName}><RefreshCcw size={14} /></Button.Ripple>
                            </Col>
                        </Row>


                        <div className="shadow-stats-item mt-3">
                            {
                                !waitingOrNewStudentsLoading &&
                                waitingOrNewStudentsError &&
                                <NoNetwork message={waitingOrNewStudentsError} />
                            }

                            {
                                !waitingOrNewStudentsLoading &&
                                !waitingOrNewStudentsError &&
                                studentList.length == 0 &&
                                <NotFound message={t("No student found")} />
                            }

                            {
                                !waitingOrNewStudentsLoading &&
                                !waitingOrNewStudentsError &&
                                studentList.length > 0 &&

                                <StudentList
                                    isNew={true}
                                    dataList={studentList}
                                    handleViewStudent={handleViewStudent}
                                    onSelect={onSelect}
                                    isActiveStudent={false}
                                />
                            }
                            {
                                studentList.length > 0 && waitingOrNewStudents.pages &&
                                <CustomPagination pages={Math.ceil(waitingOrNewStudents.pages / 20)} onSelect={onSelectPage} />

                            }
                        </div>
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        waitingOrNewStudentsListData,
        waitingOrNewStudents,
        waitingOrNewStudentsLoading,
        waitingOrNewStudentsError,

    } = state.Students

    return {
        waitingOrNewStudentsListData,
        waitingOrNewStudents,
        waitingOrNewStudentsLoading,
        waitingOrNewStudentsError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getStudentNewOrWaitingStatus, onSearchChange
    })(NewStudentsOrWaitingForTeachers)
)
