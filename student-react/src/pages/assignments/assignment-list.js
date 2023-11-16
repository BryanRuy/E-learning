import React from "react"
import { Table, Button } from "reactstrap"
import CustomPagination from "../pagination"
import moment from "moment";
import { DateTime } from '../../components/date-time';
import { useTranslation } from "react-i18next";

const AssignmentList = (props) => {

    const { t } = useTranslation()
    const { assignmentList, startAssignment, count, isNew,
        isPagination, onSelectPage, limit } = props

    const onSelectStartAssignment = (a) => {
        if (startAssignment)
            startAssignment(a)
    }

    const onSelectePageChange = (index) => {
        if (onSelectPage)
            onSelectPage(index)
    }

    return (
        <>
            <Table responsive hover className="pb-2">
                <thead>
                    <tr>
                        <th>{t('Name')}</th>
                        {
                            isNew &&
                            <>
                                <th>{t('Start Date')}</th>
                                <th>{t('Due Date')}</th>
                                <th>{t('Action')}</th>
                            </>
                        }
                        {
                            !isNew &&
                            <>
                                <th>{t('SUBMISSION DATE')}</th>
                                <th>{t('MARKS')}</th>
                            </>
                        }


                    </tr>
                </thead>
                <tbody>
                    {
                        assignmentList.filter((as, index) => index < limit).map((a, index) =>
                            <tr key={"new-assign" + index}
                                onClick={!isNew ? () => onSelectStartAssignment(a) : () => { }} >
                                <td>
                                    {a.assignment.title}
                                </td>
                                {
                                    isNew &&
                                    <>
                                        <td><DateTime dateTime={a.startDate} type="date" /></td>
                                        <td><DateTime dateTime={a.endDate} type="date" /></td>
                                        <td>
                                            {
                                                (moment().isAfter(moment(a.startDate))
                                                    || moment().isSame(moment(a.startDate))
                                                    || moment().isBefore(moment(a.endDate))
                                                    || moment().isSame(moment(a.endDate))
                                                ) &&
                                                <Button.Ripple color='flat-primary'
                                                    onClick={() => onSelectStartAssignment(a)}
                                                >
                                                    {t('Start')}
                                                </Button.Ripple>
                                            }
                                        </td>
                                    </>
                                }
                                {
                                    !isNew &&
                                    <>
                                        <td>
                                            {
                                                a.assignmentAttempt ?
                                                    <DateTime dateTime={a.assignmentAttempt.submittedAt} type="date" />
                                                    : "..."
                                            }
                                        </td>
                                        <td>
                                            {
                                                a.assignmentAttempt ?
                                                    <div>
                                                        {
                                                            a.assignmentAttempt.obtainedMarks || "..."
                                                        }
                                                        /
                                                        {
                                                            a.assignment.totalMarks
                                                        }
                                                    </div>
                                                    : "..."
                                            }
                                        </td>
                                    </>
                                }

                            </tr>
                        )}
                </tbody>
            </Table>
            {
                isPagination &&
                <CustomPagination start={1} end={Math.ceil(count / 20)} onSelect={onSelectePageChange} />
            }
        </>
    )
}

export default AssignmentList