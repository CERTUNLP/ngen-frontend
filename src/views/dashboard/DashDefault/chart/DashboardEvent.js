import React, { useEffect, useState } from 'react'
import {
    Card
 } from 'react-bootstrap';
import { getMinifiedTaxonomy } from '../../../../api/services/taxonomies';
import { getMinifiedFeed } from '../../../../api/services/feeds';
import TableEvents from '../../../event/components/TableEvents';

const DashboardEvent = ({list}) => {

    const [taxonomyNames, setTaxonomyNames] = useState({});
    const [feedNames, setFeedNames] = useState({});


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

    }, [])
  return (
    <div>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Ultimos 10 eventos en el periodo seleccionado</Card.Title>
            </Card.Header>
            <TableEvents events={list}  taxonomyNames={taxonomyNames} feedNames={feedNames} disableDateOrdering={true} 
                    disableCheckbox={true} disableDomain={true} disableCidr={true} disableTlp={true} disableColumnEdit={true}
                    disableColumnDelete={true} disableTemplate={true}/> 
        </Card>
    </div>
  )
}

export default DashboardEvent