import React from 'react';

import {
    Card,
    Table
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { DateTime } from '../../components/date-time';
import { Button } from 'reactstrap';
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import CustomPagination from '../pagination';


const TestList = (props) => {

    const {t} = useTranslation()
    const { testList, count, isNew, selectPastTest, onTestAttempt , onPageChange} = props

    const onAttemptTest = (stdTest) => {
        if (onTestAttempt)
            onTestAttempt(stdTest.studentTestId)
    }

    const onSelectedPastTest = (stdTest) => {
        if (selectPastTest)
            selectPastTest(stdTest.studentTestId)
    }
    const onSelectPage = (index) => {
        if(props.onPageChange)
          onPageChange(index, isNew)
    }

    return (
        <Card>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('TITLE')}</th>
                        <th>{t('START TIME')}</th>
                        <th>{t('END TIME')}</th>
                        <th>{t('TIME LIMIT')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        testList.map((t, index) =>
                            <tr
                                key={isNew ? 'new-test-key' + index : 'past-test-key' + index}
                                onClick={() => onSelectedPastTest(t)}
                            >
                                <td>{index + 1}</td>
                                <td>
                                    <span className='align-middle font-weight-bold'>
                                        {t.test.title}
                                    </span>
                                </td>
                                <td><DateTime dateTime={t.startTime} type="dateTime" /></td>
                                <td><DateTime dateTime={t.endTime} type="dateTime" /></td>
                                <td>{t.test.timeLimit / 60} mins</td>
                                {
                                    isNew &&
                                    <td>
                                        <Button.Ripple
                                            color='primary' outline
                                            onClick={() => onAttemptTest(t)}
                                        >
                                            {t('ATTEMPT')}
                                        </Button.Ripple>
                                    </td>
                                }
                            </tr>)
                    }
                </tbody>
            </Table>
            {
                testList &&
                testList.length > 0 &&
                <CustomPagination start={1} end={Math.ceil(count/20)} onSelect={onSelectPage}/>
            }

        </Card>
    )

}

export default TestList