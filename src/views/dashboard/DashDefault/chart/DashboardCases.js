import React, { useState, useEffect } from 'react'
import {
    Card
} from 'react-bootstrap';

import { getMinifiedState } from '../../../../api/services/states';
import { getMinifiedUser } from '../../../../api/services/users';
import TableCase from '../../../case/components/TableCase';
import { useTranslation, Trans } from 'react-i18next';

const DashboardCases = ({ list, loading }) => {
    const { t } = useTranslation();

    const [userNames, setUserNames] = useState({});
    const [stateNames, setStateNames] = useState({});

    useEffect(() => {

        getMinifiedUser()
            .then((response) => {
                let dicUser = {}
                response.map((user) => {
                    dicUser[user.url] = user.username
                })
                setUserNames(dicUser)
            })
            .catch((error) => {
                console.log(error)
            })

        getMinifiedState()
            .then((response) => {
                let dicState = {}
                response.map((state) => {
                    dicState[state.url] = state.name
                })
                setStateNames(dicState)
            })

    }, [list]);

    return (
        <div>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">{t('Panel de casos')}</Card.Title>
                </Card.Header>
                <TableCase cases={list} loading={loading} disableCheckbox={true} disableDateOrdering={true} disableName={true}
                    disablePriority={true} disableTlp={true}
                    stateNames={stateNames} userNames={userNames}
                    editColum={false} deleteColum={false} detailModal={false}
                    navigationRow={false} selectCase={true} disableNubersOfEvents={false} />

            </Card>

        </div>
    )
}

export default DashboardCases