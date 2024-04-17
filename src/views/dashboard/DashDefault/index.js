import React, { useState, useEffect } from 'react';
import { Row, Col, Card,  Form } from 'react-bootstrap';

import FeedGraph from './chart/FeedGraph';
import EntityGraph from './chart/EntityGraph';
import DashboardEvent from './chart/DashboardEvent';
import DashboardCases from './chart/DashboardCases';

import { getDashboardFeed } from '../../../api/services/dashboards';
import { getDashboardEvent } from '../../../api/services/dashboards';
import { getDashboardCases } from '../../../api/services/dashboards';
import { getDashboardNetworkEntities } from '../../../api/services/dashboards';


const DashDefault = () => {

    const [dashboardFeed, setDashboardFeed] = useState([]);
    const [dashboardEvent, setDashboardEvent] = useState([]);
    const [dashboardCases, setDashboardCases] = useState([]);
    const [dashboardNetworkEntities, setDashboardNetworkEntities] = useState([]);

    const [starDate, setStarDate] = useState(getSevenDaysAgo())
    const [endDate, setEndDate] = useState(getCurrentDate())
    const [starDateFilter, setStarDateFilter] = useState("")
    const [endDateFilter, setEndDateFilter] = useState("")

    const [loading, setLoading] = useState(true)
    useEffect( ()=> {

        getDashboardFeed(starDateFilter + endDateFilter) 
            .then((response) => {
                setDashboardFeed(response.data.feeds_in_events)
                console.log(response)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
            })

        getDashboardEvent(starDateFilter + endDateFilter) 
            .then((response) => {
                setDashboardEvent(response.data.events)
                console.log(response)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
            })

        getDashboardCases(starDateFilter + endDateFilter) 
            .then((response) => {
               
                setDashboardCases(response.data.cases)
                console.log(response.data.cases)
            })
            .catch((error) => {
                // Show alert
            })
            .finally(() => {
                setLoading(false)
            })
        
        getDashboardNetworkEntities(starDateFilter + endDateFilter) 
            .then((response) => {
                let entitiesNetwork=[{key: 'Cumulative Return',
                                    values: []
                                    }]
                const entitiesWithEventCount = response.data.network_entities.map(entity => {
                    // Agregar la propiedad 'eventCount' con la cantidad de eventos
                  
                    entity.eventCount = entity.events.length;
                    return entity;
                });
                entitiesNetwork[0].values=entitiesWithEventCount

                //console.log(entitiesWithEventCount)
                console.log(entitiesNetwork)
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
        if (getCurrentDate() >= date){
            setStarDate(date)
            setStarDateFilter("date_from="+date+"T00:00:00Z"+'&')
        }
      }
    
      const completeDateEnd = (date) => {
        console.log(date)
        if (getCurrentDate() >= date){
            setEndDate(date)
            setEndDateFilter("date_to"+date+"T00:00:00Z"+'&')
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


    return (
        <React.Fragment>    
            <Row>
            <Col sm={12} lg={6}>
              <Form.Group controlId="formGridAddress1">
                <Form.Label>Fecha desde</Form.Label>
                <Form.Control 
                  type="date"
                  maxLength="150" 
                  placeholder="Fecha desde"
                  max={getCurrentDate()}
                  value={starDate} 
                  isInvalid={starDate > getCurrentDate()} 
                  onChange={(e) => completeDateStar(e.target.value)}
                  name="date"
                />
                {starDate > getCurrentDate() ? <div className="invalid-feedback"> Se debe ingresar una fecha menor a la de hoy</div> : ""  }
              </Form.Group>
            </Col>
            <Col sm={12} lg={6}>
              <Form.Group controlId="formGridAddress1">
                <Form.Label>Fecha hasta</Form.Label>
                <Form.Control 
                  type="date"
                  maxLength="150" 
                  max={getCurrentDate()}
                  value={endDate} 
                  isInvalid={endDate > getCurrentDate()} 
                  onChange={(e) => completeDateEnd(e.target.value)}
                  name="date"
                />
                {endDate > getCurrentDate() ? <div className="invalid-feedback"> Se debe ingresar una fecha menor a la de hoy</div> : ""  }
              </Form.Group>
            </Col>
          </Row> 
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Grafico de fuentes</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <FeedGraph dashboardFeed={dashboardFeed}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Grafico de entidades afectadas</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                        <EntityGraph list={dashboardNetworkEntities.length > 0  ? dashboardNetworkEntities[0].values : []} />
                        </Card.Body>
                    </Card>
                    
                </Col>
                <Col>
                    <DashboardEvent list={dashboardEvent} />
                </Col>
                <Col>
                    <DashboardCases list={dashboardCases} loading={loading}/>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default DashDefault;
