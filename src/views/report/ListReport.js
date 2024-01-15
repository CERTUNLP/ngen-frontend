import React, { useState, useEffect } from 'react';
import { getReports} from "../../api/services/reports";
import { Row, Col, Card } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import Navigation from '../../components/Navigation/Navigation'
import Search from '../../components/Search/Search'
import CrudButton from '../../components/Button/CrudButton';
import TableReport from './components/TableReport'
import AdvancedPagination from '../../components/Pagination/AdvancedPagination';
import Alert from '../../components/Alert/Alert';

const ListReport = () => {
    const [loading, setLoading] = useState(true)
    const [reports, setReports] = useState([])
    const [error, setError] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [countItems, setCountItems] = useState(0);
    const [updatePagination, setUpdatePagination] = useState(false)
    const [disabledPagination, setDisabledPagination] = useState(true)


    const [showAlert, setShowAlert] = useState(false)

    const resetShowAlert = () => {
        setShowAlert(false);
      }

    function updatePage(chosenPage){
        setCurrentPage(chosenPage);
    }

    useEffect(() => {

            getReports(currentPage, "", "")
            .then((response) => {
                setReports(response.data.results)
                setCountItems(response.data.count)
                if(currentPage === 1){
                  setUpdatePagination(true)  
                }
                setDisabledPagination(false)
            }).catch((error)=>{
                setError(error)
              })
              .finally(() => {
                  setShowAlert(true)
                  setLoading(false)
              })
    
    
        }, [ currentPage])

        
    
  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert}/>
      <Row>
        <Navigation actualPosition="Reporte"/>
      </Row>
      <Card>
        <Card.Header>
          <Row>
            <Col sm={12} lg={9}>
                <Search  />
            </Col>
            <Col sm={12} lg={3}>
                <Link to={{pathname:'/reports/create'}} >
                    <CrudButton type='create' name='reporte' />
                </Link>
          
            </Col> 
          </Row>                                 
          </Card.Header>
          <Card.Body> 
            <TableReport list={reports}  loading={loading} currentPage={currentPage} /> 
          </Card.Body>
          <Card.Footer >
            <Row className="justify-content-md-center">
                <Col md="auto"> 
                  <AdvancedPagination countItems={countItems} updatePage={updatePage} updatePagination={updatePagination} setUpdatePagination={setUpdatePagination} setLoading={setLoading} setDisabledPagination={setDisabledPagination} disabledPagination={disabledPagination}/>
                </Col>
            </Row>
          </Card.Footer>
      </Card>
  </div>
  )
}

export default ListReport