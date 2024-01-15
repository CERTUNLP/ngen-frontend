import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { postReport } from '../../api/services/reports';
import FormReport from './components/FormReport';
import Navigation from '../../components/Navigation/Navigation';
import Alert from '../../components/Alert/Alert';
import { getAllTaxonomies } from "../../api/services/taxonomies";

const CreateReport = () => {
    const [body, setBody] = useState({
        problem: "",
        derived_problem: "", //required
        verification: "",//required
        recommendations: "",//required
        more_information: "",//required
        lang: "",
        taxonomy: null//required
    })
    const [taxonomies, setTaxonomies] = useState([])

    const [error,setError]=useState()
    const [loading, setLoading] = useState(true)

    //Alert
    const [showAlert, setShowAlert] = useState(false);

    useEffect( ()=> {
        getAllTaxonomies().then((response) => { 
    
            setTaxonomies(response)
          })
          .catch((error) => {
              setError(error)
              
          }).finally(() => {
              setLoading(false)
          })
        
      },[]);
    

    //Create
    const addReport = () => {
        postReport(body.problem, body.derived_problem, body.verification, body.recommendations, body.more_information, body.lang, body.taxonomy)
        .then((response) => { 
            window.location.href = "/reports"
        })
        .catch((error) => {
            console.log(error)
            setShowAlert(true)
        })
    };
       
    return (
        <React.Fragment>
        <Alert showAlert={showAlert} resetShowAlert={() => setShowAlert(false)} component="entity"/>
            <Row>
                <Navigation actualPosition="Crear reporte" path="/reports" index ="Reportes"/>
            </Row>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Reporte</Card.Title>
                            <span className="d-block m-t-5">Agregar Reporte</span>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={12} lg={12}>
                                    <FormReport body={body} setBody={setBody} taxonomies={taxonomies} 
                                    createOrEdit={addReport}/>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CreateReport