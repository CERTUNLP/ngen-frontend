
import React, { useEffect, useState } from 'react'
import { Card, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import CrudButton from '../../../components/Button/CrudButton';
import CallBackendByName from '../../../components/CallBackendByName';
import { getTaxonomy } from '../../../api/services/taxonomies';
import { getTLPSpecific } from '../../../api/services/tlp';
import { getFeed } from '../../../api/services/feeds';
import { useTranslation, Trans } from 'react-i18next';


const SmallEventTable = ({ list }) => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        setEvents(list)
        console.log("entra")

    }, [list]);

    const callbackTaxonomy = (url, setPriority) => {
        getTaxonomy(url)
            .then((response) => {
                setPriority(response.data)
            })
            .catch();
    }
    const callbackTlp = (url, setPriority) => {
        getTLPSpecific(url)
            .then((response) => {
                setPriority(response.data)
            })
            .catch();
    }
    const callbackFeed = (url, setPriority) => {
        getFeed(url)
            .then((response) => {
                setPriority(response.data)
            })
            .catch();
    }


const { t } = useTranslation();
    console.log(events)
    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">{t('Eventos')}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Table responsive hover className="text-center">
                            {events.length > 0 ? <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t('Fecha')}</th>
                                    <th>{t('Identificador')} </th>
                                    <th>{t('Dominio')}</th>
                                    <th>{t('Cidr')}</th>
                                    <th>{t('TLP')}</th>
                                    <th>{t('Taxonomia')}</th>
                                    <th>{t('Fuente de Informacion')}</th>
                                    <th>{t('Opciones')}</th>
                                </tr>
                            </thead> : <></>}
                            <tbody>
                                {events.length > 0 ? events.map((event, index) => {
                                    console.log(event)
                                    return (
                                        <tr key={index}>

                                            <td>{1 + index}</td>

                                            <td>{event.date ? event.date.slice(0, 10) + " " + event.date.slice(11, 19) : ""}</td>
                                            <td>{event.address_value}</td>
                                            <td>{event.domain}</td>
                                            <td>{event.cidr}</td>

                                            <td><CallBackendByName url={event.tlp} callback={callbackTlp} useBadge={true} /></td>

                                            <td><CallBackendByName url={event.taxonomy} callback={callbackTaxonomy} useBadge={false} /></td>

                                            <td><CallBackendByName url={event.feed} callback={callbackFeed} useBadge={false} /></td>

                                            <td>
                                                <Link to={{ pathname: "/events/view", state: event }} >
                                                    <CrudButton type='read' />
                                                </Link>
                                            </td>

                                        </tr>
                                    )
                                }) : <tr><td colSpan="9">{t('No hay eventos')}</td></tr>}

                            </tbody>
                        </Table>
                    </Row>
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default SmallEventTable