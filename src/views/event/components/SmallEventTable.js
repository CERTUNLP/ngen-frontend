import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { getMinifiedTaxonomy } from '../../../api/services/taxonomies';
import { getMinifiedTlp } from '../../../api/services/tlp';
import { getMinifiedFeed } from '../../../api/services/feeds';
import TableEvents from './TableEvents';


const SmallEventTable = ({ list, disableLink, modalListEvent, modalEventDetail, deleteEventFromForm, disableColumOption }) => {

    const [taxonomyNames, setTaxonomyNames] = useState({});
    const [feedNames, setFeedNames] = useState({});
    const [tlpNames, setTlpNames] = useState({});


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
        getMinifiedTlp().then((response) => {
            let dicTlp = {};
            response.map((tlp) => {
                dicTlp[tlp.url] = { name: tlp.name, color: tlp.color };
            });
            setTlpNames(dicTlp);
        });

    }, [])

    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <Row>
                        <Col sm={12} lg={10}>
                            <Card.Title as="h5">Eventos</Card.Title>
                        </Col>
                        {/*disableLink  ? "":
                    <Col sm={12} lg={2}>
                        <Button 
                                size="lm"
                                variant="outline-dark"
                                onClick={() => modalEvent()}
                                >
                                Crear evento
                        </Button>
                    </Col> 
                    */}
                        {disableLink ? "" :
                            <Col sm={12} lg={2}>
                                <Button
                                    size="lm"
                                    variant="outline-dark"
                                    onClick={() => modalListEvent()}
                                >
                                    Vincular a Eventos
                                </Button>
                            </Col>
                        }
                    </Row>
                </Card.Header>
                <Card.Body>
                    <TableEvents events={list} taxonomyNames={taxonomyNames} feedNames={feedNames} tlpNames={tlpNames}
                        disableDateOrdering={true} disableCheckbox={true} disableTemplate={true} deleteColumForm={true}
                        disableColumnEdit={true} disableCheckboxAll={true} detailModal={true} modalEventDetail={modalEventDetail}
                        deleteEventFromForm={deleteEventFromForm} disableColumOption={disableColumOption} />
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default SmallEventTable