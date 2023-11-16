import React from 'react';
import { useState, Fragment } from 'react';

import {
    CardBody, Table,
    Card,
    CardText,
    Row,
    Col,
    CardHeader, CardTitle, Label, Input,
} from 'reactstrap';


import { ChevronDown, RefreshCcw } from 'react-feather'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import CardReload from '../../@core/components/card-reload';
import { DateTime } from '../../components/date-time';
import CustomPagination from '../pagination';

const UsersList = (props) => {

    const { t } = useTranslation()
    const { listData, fetchListData, isReloading, isTeacher, onSelectPage ,pagesCount } = props;
    const [searchValue, setSearchValue] = useState('')

    const onAssignTeacher = (teacher) => {
        props.onAssignTeacher(teacher)
    }

    const onUnAssignTeacher = (student) => {
        props.onUnassignTeacher(student)
    }

    const searchTeacherByName = () => {
        if (searchValue)
            props.fetchData(searchValue)
    }


    return (
        <Fragment>
            <CardReload
                title={isTeacher ? t('Teachers') : t('Students')}
                onReload={fetchListData}
                isReloading={isReloading}>

                {
                    isTeacher &&
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
                            <Button.Ripple className="btn-icon ml-1" size="sm" onClick={searchTeacherByName}><RefreshCcw size={14} /></Button.Ripple>
                        </Col>
                    </Row>
                }

                <Table responsive hover >
                    <thead>
                        <tr>
                            <th>{t('Name')}</th>
                            <th>{t('Email')}</th>
                            <th>{t('Start Date')}</th>
                            {
                                isTeacher &&
                                <th>{t('Assign')}</th>
                            }
                            {
                                !isTeacher &&
                                <th>{t('Unassign')}</th>
                            }
                        </tr>

                    </thead>
                    <tbody>
                        {listData.map((s, index) =>
                            <tr key={'student' + index} >
                                <td>
                                    {s.name}
                                </td>
                                <td>
                                    {s.email}
                                </td>
                                <td><DateTime dateTime={s.createdAt} /></td>
                                <td>
                                    {
                                        isTeacher &&

                                        <Button.Ripple color='flat-primary'
                                            onClick={() => onAssignTeacher(s)} >
                                            {t('Assign')}
                                        </Button.Ripple>

                                    }
                                    {
                                        !isTeacher &&
                                        <Button.Ripple color='flat-primary'
                                            onClick={() => onUnAssignTeacher(s)}
                                        >
                                            {t('Unassign')}
                                        </Button.Ripple>

                                    }
                                </td>

                            </tr>
                        )}
                    </tbody>
                </Table>
                
                {
                    isTeacher &&
                     <CustomPagination pages={Math.ceil(pagesCount / 20)} onSelect={onSelectPage} />
                }

            </CardReload>
        </Fragment>
    );
};

export default UsersList


