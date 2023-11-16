import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Button, Table,
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap'

// ** Store & Actions
import { connect } from 'react-redux'
import { getPastTests, getUpcomingTests, newTestAttempt, submitTestAttempt } from './store/actions'
import { withRouter } from 'react-router';
import UILoader from '../../@core/components/ui-loader';
import { notifyError } from '../../utility/toast'
import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TestList from './TestsList';
import { useTranslation } from 'react-i18next';

const MySwal = withReactContent(Swal)

const AppTests = (props) => {

    const { t } = useTranslation()
    const [active, setActive] = useState('1')
    const [currentpage, setCurrentpage] = useState(1)
    const [pastTestsData, setPastTestsData] = useState()
    const [newTestsData, setNewTestsData] = useState()

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const onTestAttempt = (id) => {
        return MySwal.fire({
            icon: 'question',
            title: "Confirm",
            text: 'The test cannot be paused once you start and test can be attempted only once. \nAre you sure you want to start the test?',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ml-1'
            },
            showCancelButton: true,
            confirmButtonText: 'Yes',
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                props.newTestAttempt({
                    id: id,
                    data: {
                        studentTestId: id
                    }
                })
            }
        })
    }

    const onPageChange = (index, isNew) => {
        setCurrentpage(index)
        let data = { "page": index, "limit": 20 }
        if (isNew) {
            if (props.newTestList[index]) setNewTestsData(props.newTestList[index])
            else props.getUpcomingTests(data)
        } else {
            if (props.pastTestList[index]) setPastTestsData(props.pastTestList[index])
            else props.getPastTests(data)
        }
    }

    useEffect(() => {
        if (props.pastTestList && props.pastTestList[currentpage])
            setPastTestsData(props.pastTestList[currentpage])
    }, [props.pastTestList])

    useEffect(() => {
        if (props.newTestList && props.newTestList[currentpage])
            setNewTestsData(props.newTestList[currentpage])
    }, [props.newTestList])

    useEffect(() => {
        let data = { "page": 1, "limit": 20 }
        props.getPastTests(data)
        props.getUpcomingTests()
    }, [])

    useEffect(() => {
        if (props.attemptId && Object.keys(props.selectedTest).length > 0) {
            props.history.push('/tests/attempt')
        }
    }, [props.selectedTest])

    useEffect(() => {
        if (!props.attemptTestLoading && props.attemptTestError) {
            notifyError("Test Attempt", props.attemptTestError)
        }
    }, [props.attemptTestError])

    const selectPastTest = (id) => {
        props.history.push(`/attempt-details/${id}`)
    }

    useEffect(() => {
        setNewTestsData(props.newTests.data)
    }, [props.newTests])

    useEffect(() => {
        setPastTestsData(props.pastTests.data)
    }, [props.pastTests])

    const newTestsView = () => {
        return <>{
            !props.newTestsLoading &&
            !props.newTestsError &&
            props.newTests.data &&
            props.newTests.data.length === 0 &&
            <NotFound />
        }
            {
                !props.newTestsLoading && props.newTestsError &&
                <NoNetwork />
            }
            {
                !props.newTestsLoading &&
                !props.newTestsError &&
                props.newTests.data &&
                newTestsData &&
                newTestsData.length > 0 &&
                props.newTests.data.length > 0 &&
                <TestList
                    testList={newTestsData}
                    count={props.newTests.count}
                    isNew={true}
                    onPageChange={onPageChange}
                    onTestAttempt={onTestAttempt}
                />

            }
        </>
    }



    const pastTestsView = () => {
        return (<>
            {
                !props.pastTestsLoading &&
                !props.pastTestsError &&
                props.pastTests.data &&
                props.pastTests.data.length == 0 &&
                <NotFound />
            }
            {
                !props.pastTestsLoading && props.pastTestsError &&
                <NoNetwork />
            }
            {
                !props.pastTestsLoading &&
                !props.pastTestsError &&
                props.pastTests.data &&
                props.pastTests.data.length > 0 &&
                pastTestsData &&
                pastTestsData.length > 0 &&
                <TestList
                    testList={pastTestsData}
                    isNew={false}
                    count={props.pastTests.count}
                    onPageChange={onPageChange}
                    selectPastTest={selectPastTest}
                />
            }
        </>)
    }

    return (
        <Fragment >
            <UILoader blocking={props.newTestsLoading || props.pastTestsLoading || props.attemptTestLoading} >
                <Card>
                    <CardBody>
                        <Nav tabs fill>
                            <NavItem>
                                <NavLink
                                    active={active === '1'}
                                    onClick={() => {
                                        toggle('1')
                                    }}
                                >
                                   {t('Past Tests')}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    active={active === '2'}
                                    onClick={() => {
                                        toggle('2')
                                    }}
                                >
                                    {t('Upcoming Tests')}
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent className='py-50' activeTab={active}>
                            <TabPane tabId='1'>
                                {
                                    pastTestsView()
                                }
                            </TabPane>
                            <TabPane tabId='2'>
                                {
                                    newTestsView()
                                }

                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {

        newTests,
        newTestsLoading,
        newTestsError,

        pastTestList,
        pastTests,
        pastTestsLoading,
        pastTestsError,

        attemptTestLoading,
        selectedTest,
        currentIndex,
        attemptId,
        attemptTestError,

    } = state.Tests;
    return {
        newTests,
        newTestsLoading,
        newTestsError,

        pastTestList,
        pastTests,
        pastTestsLoading,
        pastTestsError,

        attemptTestLoading,
        selectedTest,
        currentIndex,
        attemptId,
        attemptTestError,
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getPastTests, getUpcomingTests, newTestAttempt, submitTestAttempt
    })(AppTests)
)
