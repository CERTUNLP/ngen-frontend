import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';

import FeedGraph from './chart/FeedGraph';
import EntityGraph from './chart/EntityGraph';
import DashboardEvent from './chart/DashboardEvent';
import DashboardCases from './chart/DashboardCases';

import { getDashboardFeed } from '../../../api/services/dashboards';
import { getDashboardEvent } from '../../../api/services/dashboards';
import { getDashboardCases } from '../../../api/services/dashboards';
import { getDashboardNetworkEntities } from '../../../api/services/dashboards';
import { getMinifiedTaxonomy } from '../../../api/services/taxonomies';
import { getMinifiedFeed } from '../../../api/services/feeds';
import { useTranslation } from 'react-i18next';


const DashDefault = () => {

    const [dashboardFeed, setDashboardFeed] = useState([]);
    const [dashboardEvent, setDashboardEvent] = useState([]);
    const [dashboardCases, setDashboardCases] = useState([]);
    const [dashboardNetworkEntities, setDashboardNetworkEntities] = useState([]);

    const [starDate, setStarDate] = useState(getSevenDaysAgo())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [starDateFilter, setStarDateFilter] = useState("")
    const [endDateFilter, setEndDateFilter] = useState("")
    const [starDateNotification, setStarDateNotification] = useState(false)
    const [endDateNotification, setEndDateNotification] = useState(false)

    const [taxonomyNames, setTaxonomyNames] = useState({});
    const [feedNames, setFeedNames] = useState({});


    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getMinifiedTaxonomy().then((response) => {
            let dicTaxonomy = {};
            response.map((taxonomy) => {
                dicTaxonomy[taxonomy.url] = taxonomy.name;
            });
            setTaxonomyNames(dicTaxonomy);
        });
        getMinifiedFeed().then((response) => {
            let dicFeed = {};
            response.map((feed) => {
                dicFeed[feed.url] = feed.name;
            });
            setFeedNames(dicFeed);
        });


        getDashboardFeed(starDateFilter + endDateFilter)
            .then((response) => {
                setDashboardFeed(response.data.feeds_in_events)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
            })

        getDashboardEvent(starDateFilter + endDateFilter)
            .then((response) => {
                setDashboardEvent(response.data.events)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
            })

        getDashboardCases(starDateFilter + endDateFilter)
            .then((response) => {

                setDashboardCases(response.data.cases)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
                setLoading(false)
            })

        getDashboardNetworkEntities(starDateFilter + endDateFilter)
            .then((response) => {
                let entitiesNetwork = [{
                    key: 'Cumulative Return',
                    values: []
                }]
                const entitiesWithEventCount = response.data.network_entities.map(entity => {
                    // Agregar la propiedad 'eventCount' con la cantidad de eventos

                    entity.eventCount = entity.events.length;
                    return entity;
                });
                entitiesNetwork[0].values = entitiesWithEventCount

                //console.log(entitiesWithEventCount)
                setDashboardNetworkEntities(entitiesNetwork)

            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
                setLoading(false)
            })


    }, [starDateFilter, endDateFilter])
    const completeDateStar = (date) => {
        console.log(date)
        if (getCurrentDate() >= date && date <= endDate) {
            setStarDate(date)
            setStarDateFilter("date_from=" + date + "T00:00:00Z" + '&')
            setStarDateNotification(false)
        } else {
            setStarDateNotification(true)
        }
    }

    const completeDateEnd = (date) => {
        console.log(endDate)
        if (getCurrentDate() >= date && date >= starDate && endDate >= starDate) {
            console.log(endDate)
            console.log(endDateFilter)
            setEndDate(date)
            setEndDateFilter("date_to=" + date + "T00:00:00Z")
            setEndDateNotification(false)
        } else {
            setEndDateNotification(true)
        }
    }

    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getSevenDaysAgo() {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // Subtract 7 days worth of milliseconds
        const year = sevenDaysAgo.getFullYear();
        const month = (sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0');
        const day = sevenDaysAgo.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    //console.log(props.body.date < getCurrentDate()) valido

    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Row>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>{t('date.condition_from')}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            maxLength="150"
                            placeholder={t('date.condition_from')}
                            max={getCurrentDate()}
                            value={starDate}
                            isInvalid={starDateNotification}
                            onChange={(e) => completeDateStar(e.target.value)}
                            name="date"
                        />
                        {starDateNotification ? <div className="invalid-feedback">{t('Se debe ingresar una fecha menor a la de hoy')}</div> : ""}
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>{t('date.condition_to')}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            maxLength="150"
                            max={getCurrentDate()}
                            value={endDate}
                            isInvalid={endDateNotification}
                            onChange={(e) => completeDateEnd(e.target.value)}
                            name="date"
                        />
                        {endDateNotification ? <div className="invalid-feedback">{t('Se debe ingresar una fecha menor a la de hoy')}</div> : ""}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">{t('sources_graphic')}</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <FeedGraph dashboardFeed={dashboardFeed} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">{t('ngen.entity_graphic')}</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <EntityGraph list={dashboardNetworkEntities.length > 0 ? dashboardNetworkEntities[0].values : []} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <DashboardEvent list={dashboardEvent} feedNames={feedNames} taxonomyNames={taxonomyNames} />
                </Col>
                <Col>
                    <DashboardCases list={dashboardCases} loading={loading} />
                </Col>
            </Row>
        </React.Fragment >
    );
};

export default DashDefault;
