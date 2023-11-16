import React from 'react';
import {
    CardBody,
    Table
} from 'reactstrap';
import { DateTime } from '../../components/date-time';
import PropTypes from 'prop-types';
import CardReload from '../../@core/components/card-reload';
import { useTranslation } from 'react-i18next';

const AttemptList = (props) => {

    const { attempts } = props;
    const {t} = useTranslation()
    const onSelectAttempt = (attempt) => {
        if (props.onSelect) {
            if (attempt.submittedAt)
                props.onSelect(attempt);
        }
    }

    return (
        <CardReload
            title='Attempts'>
            <CardBody>
                <Table responsive hover >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('Started At')}</th>
                            <th>{t('Submitted At')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts && attempts.map((a, i) =>
                            <tr key={a.attemptId} onClick={() => onSelectAttempt(a)}>
                                <td>{i + 1}</td>
                                <td><DateTime dateTime={a.createdAt} type="datetime" /></td>
                                <td><DateTime dateTime={a.submittedAt} invalidValueText="N/A" type="datetime" /></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </CardReload>
    );
};


AttemptList.propTypes = {
    onSelect: PropTypes.func,
    attempts: PropTypes.array.isRequired,
    onBack: PropTypes.func
}


export default AttemptList;



