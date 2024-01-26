import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, CloseButton } from 'react-bootstrap';
import { putEdge } from "../../../api/services/edges";
import FormCreateEdge from './FormCreateEdge';


const ModalEditEdge = (props) => {
    const [error, setError] = useState(null);
    const [body, setBody] = useState(props.edge);
    const [selectChild, setSelectChild] = useState({value:props.edge.child, label:props.urlByStateName[props.edge.child]});
    


    useEffect(()=>{

    },[])

    const editEdge = () => { 

        putEdge(body.url, body.discr ,body.parent , body.child)
            .then((response) => { 
                console.log(response)
                console.log('se edito una tarea')
                props.ifEdit(response)
                props.onHide()
            })
            .catch((error) => {
                setError(error)
                console.log(error)
            })
            .finally(() => {
                props.setShowAlert(true)
            })
    };

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
                                            <Card.Title as="h5">Transición</Card.Title>
                                            <span className="d-block m-t-5">Editar transición</span>
                                        </Col>
                                        <Col sm={12} lg={2}>                       
                                            <CloseButton aria-label='Cerrar' onClick={props.onHide} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                <FormCreateEdge
                                    body={body} 
                                    setBody={setBody}
                                    selectChild={selectChild} 
                                    setSelectChild={setSelectChild}
                                    childernes={props.childrens}
                                    ifConfirm={editEdge} 
                                    ifCancel={props.onHide} />
                                </Card.Body>
                            </Card>
                        </Col> 
                    </Row>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    ) 
}

export default ModalEditEdge