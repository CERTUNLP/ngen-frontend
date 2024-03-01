import React,{ useState} from 'react'
import {
    Card, Table , Modal, Row,Col, Form, Badge,CloseButton, Spinner
  } from 'react-bootstrap';
import CrudButton from '../../../components/Button/CrudButton';
import {Link} from 'react-router-dom'

import Alert from '../../../components/Alert/Alert';
import CallBackendByName from '../../../components/CallBackendByName'; 
import { getTaxonomy } from "../../../api/services/taxonomies";
import { deleteReport } from "../../../api/services/reports";
import ModalConfirm from '../../../components/Modal/ModalConfirm';

const TableReport = ({list, loading, currentPage}) => {
 
    const [report,setReport] = useState({})
    const [modalShow, setModalShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false)

    const [deleteUrl, setDeleteUrl] = useState()
    const [remove, setRemove] = useState()
    const [deleteName, setDeleteName] = useState("")
    const [error, setError] = useState(null);

    const language={
        en: "Ingles",
        es: "Español"}

    if (loading) {
        return (
            <Row className='justify-content-md-center'>
                <Spinner animation='border' variant='primary' size='sm' />
            </Row>
        );    
    }

    const resetShowAlert = () => {
        setShowAlert(false);
    }

    const modalDelete = ( url)=>{
        setDeleteUrl(url) 
        setRemove(true)
    }

    const showModalReport = (user) => {
        setReport(user)
        setModalShow(true)
       
    }

    const handleDelete = () => {
        deleteReport(deleteUrl).then(() => {
            window.location.href = '/reports';
          })
          .catch((error) => {
            setError(error);
          })
    }

    const callbackTaxonomy = (url ,setPriority) => {
        getTaxonomy(url)
        .then((response) => {
         
            setPriority(response.data)
        })
        .catch();
    }

      
      
  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert}/>  
       
                <ul className="list-group my-4">
                    <Table responsive hover className="text-center">
                        <thead>
                            <tr>
                                <th>Taxonomia</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((report, index) => {
                            return (
                                        <tr>
                                           
                                            <td><CallBackendByName url={report.taxonomy} callback={callbackTaxonomy} useBadge={false}/></td>
                                            <td>
                                            <CrudButton type='read' onClick={() => showModalReport(report)} />
                                            <Link to={{pathname:'/reports/edit', state: report}} >
                                                <CrudButton type='edit'/>
                                            </Link>
                                            <CrudButton type='delete' onClick={() => modalDelete( report.url)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </Table>
                    <ModalConfirm type='delete' component='Reporte' name={deleteName} showModal={remove} onHide={() => setRemove(false)} ifConfirm={() => handleDelete(deleteUrl)}/> 
                    <Modal size='lg' show={modalShow} onHide={() => setModalShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>            
            <Modal.Body>
                <Row>    
                    <Col>                 
                        <Card>
                            <Card.Header> 
                                <Row>
                                    <Col>
                                        <Card.Title as="h5">Reporte</Card.Title>
                                        <span className="d-block m-t-5">Detalle del reporte</span>
                                    </Col>
                                    <Col sm={12} lg={4}>                       
                                            <Link to={{pathname:'/reports/edit', state: report}} >
                                                <CrudButton type='edit'/>
                                            </Link>
                                        <CloseButton aria-label='Cerrar' onClick={() => setModalShow(false)} />
                                    </Col>
                                </Row>         
                            </Card.Header>
                            <Card.Body>
                                <Table responsive >
                                    <tr>
                                        <td>Problema</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.problem} />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Derivacion del problema</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.derived_problem } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Verificación</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.verification} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Recomendación</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.recommendations } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Idioma</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={language[report.lang] } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mas información</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.more_information } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>taxonomia</td>
                                        <td>
                                            <CallBackendByName url={report.taxonomy} callback={callbackTaxonomy} useBadge={false}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Creación</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.created ? report.created.slice(0,10)+" "+report.created.slice(11,19) : ""} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Actualización</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={report.modified ? report.modified.slice(0,10)+" "+report.modified.slice(11,19): ""} />
                                        </td>
                                    </tr>
                                    
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col> 
                </Row>
            </Modal.Body>            
        </Modal>
                </ul>
           
    </div>
  )
}

export default TableReport