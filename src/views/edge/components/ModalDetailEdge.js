import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Table, Modal, CloseButton } from 'react-bootstrap';

const ModalDetailEdge = (props) => {
    const [created, setCreated] = useState('');
    const [modified, setModified] = useState('');

    const [row, setRow] = useState(1);

    useEffect(()=>{
        if(props.edge){
            formatDate(props.edge.created, setCreated)
            formatDate(props.edge.modified, setModified)   
        }
    },[props.task])


    const formatDate = (datetime, set) => {
        datetime = datetime.split('T')
        let format = datetime[0] + ' ' + datetime[1].slice(0,8); 
        set(format)
    }

    const textareaStyle = {
        resize:"none", 
        backgroundColor:"transparent", 
        border:"none", 
        boxShadow: "none"
    }

    return (
        <React.Fragment>
            <Modal size='lg' show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <Row>    
                        <Col>                 
                            <Card>
                                <Card.Header> 
                                    <Row>
                                        <Col>
                                            <Card.Title as="h5">Tarea</Card.Title>
                                            <span className="d-block m-t-5">Detalle de la tarea</span>
                                            
                                        </Col>
                                        <Col sm={12} lg={2}>             
                                            <CloseButton aria-label='Cerrar' onClick={props.onHide} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Table responsive >
                                    <tbody>
                                       
                                        <tr>
                                            <td>Nombre de la transición</td>
                                            <td>
                                                <Form.Control plaintext readOnly value={props.edge.discr} style={textareaStyle} as="textarea" rows={row}/>
                                            </td>
                                        </tr>

                                        {props.laterStateName ? 
                                            <tr>
                                                <td>Nombre del estado posterior</td>
                                                <td>
                                                    <Form.Control plaintext readOnly defaultValue={props.laterStateName} />
                                                </td>
                                            </tr>
                                            : 
                                            <></>
                                        } 
                                            
                                        <tr>
                                            <td>Creación</td>
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue={created} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Actualización</td>
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue={modified} />
                                            </td>
                                        </tr>
                                    </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col> 
                    </Row>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default ModalDetailEdge