
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { getMinifiedTaxonomy} from '../../../api/services/taxonomies';
import { getMinifiedTlp} from '../../../api/services/tlp';
import { getMinifiedFeed } from '../../../api/services/feeds';
import TableEvents from './TableEvents';

const SmallEventTable = ({ list }) => {

    const [taxonomyNames, setTaxonomyNames] = useState({});
    const [feedNames, setFeedNames] = useState({});
    const [tlpNames, setTlpNames] = useState({});


    useEffect( ()=> {
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
    console.log(list)

    return (
        <React.Fragment>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">Eventos</Card.Title>
                </Card.Header>
                <Card.Body>
                    <TableEvents events={list}  taxonomyNames={taxonomyNames} feedNames={feedNames} tlpNames={tlpNames}
                    disableDateOrdering={true} disableCheckbox={true} disableColumnDelete={true} disableTemplate={true} disableColumnEdit={true}/>
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default SmallEventTable