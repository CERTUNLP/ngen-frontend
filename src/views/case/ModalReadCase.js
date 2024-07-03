import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReadCase from './ReadCase';
import './ModalReadCase.css'

const ModalReadCase = ({ modalShowCase, tableDetail, returnToListOfCases, linkCaseToEvent, closeModalDetail }) => {
  return (
    <Modal show={modalShowCase} size="lg" onHide={tableDetail ? closeModalDetail : returnToListOfCases}
      aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <div id="example-collapse-text">
          <ReadCase />
        </div>
      </Modal.Body>
      {tableDetail ?
        ""
        :
        <Modal.Footer>
          <Button variant="outline-primary" onClick={linkCaseToEvent}>Vincular</Button>
          <Button variant="outline-secondary" onClick={returnToListOfCases}>Volver al listado</Button>
        </Modal.Footer>
      }
    </Modal>
  );
};

export default ModalReadCase;