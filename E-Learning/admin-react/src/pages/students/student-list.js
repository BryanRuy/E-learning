
import React from 'react'
import { Button, Table } from 'reactstrap'
import { DateTime } from '../../components/date-time';
import { useTranslation } from 'react-i18next'

const StudentList = (props) => {

    const { t } = useTranslation();
    const { dataList, isNew ,isActiveStudent} = props

    const onSelect = (student) => {
        props.onSelect(student)
    }

    const handleViewStudent = (student) => {
        props.handleViewStudent(student)
    }

   
    return (

        <>
            <Table responsive hover >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('Name')}</th>
                        <th>{t('Email')}</th>
                        <th>{t('DATE/TIME')}</th>
                        <th>{t('Action')}</th>
                        {
                            !isActiveStudent &&
                            <th>{t('Assign')}</th>
                        }
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList.map((s, i) =>

                            <tr key={"students-" + i}>
                                <td>{i + 1}</td>
                                <td>
                                    <span className='align-middle font-weight-bold'>
                                        {s.name}
                                    </span>
                                </td>
                                <td>{s.email}</td>
                                <td><DateTime dateTime={s.createdAt} type="dateTime" /></td>
                                <td><Button color="flat-primary" onClick={() => handleViewStudent(s)}>{t('View')}</Button></td>
                                {
                                    !isActiveStudent &&
                                    <td><Button color="flat-primary" onClick={() => onSelect(s)}>{t('Assign')}</Button></td>
                                }
                            </tr>
                        )}
                </tbody>
            </Table>
           
        </>
    )

}

export default StudentList