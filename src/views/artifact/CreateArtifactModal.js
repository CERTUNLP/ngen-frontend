import React, { useState } from 'react';
import { Modal, Row, Col, Card, CloseButton } from 'react-bootstrap';
import FormArtifact from './components/FormArtifact';

const CreateArtifactModal = ({ show, onHide, value, setValue, typeArtifact, setTypeArtifact, createArtifact }) => {
    return (
        <Modal size='lg' show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <Row>    
                    <Col>                 
                        <Card>
                            <Card.Header> 
                                <Row>
                                    <Col>
                                        <Card.Title as="h5">Artefacto</Card.Title>
                                        <span className="d-block m-t-5">Crear Artefacto</span>
                                    </Col>
                                    <Col sm={12} lg={2}>                       
                                        <CloseButton aria-label='Cerrar' onClick={onHide} />
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <FormArtifact 
                                    value={value} setValue={setValue}
                                    type={typeArtifact} setType={setTypeArtifact}
                                    ifConfirm={createArtifact} ifCancel={onHide} 
                                />
                            </Card.Body>
                        </Card>
                    </Col> 
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default CreateArtifactModal;
