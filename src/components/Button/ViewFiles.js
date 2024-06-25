import React, { useState } from 'react';
import { Button, Card, } from 'react-bootstrap';
import { deleteEvidence } from '../../api/services/evidences';
import ModalConfirm from '../Modal/ModalConfirm';

const ViewFiles = (props) => {
    const [modalDelete, setModalDelete] = useState(false);
    const [name, setName] = useState("");

    const openFile = () => {
        window.open(props.file.file, props.index);
    };

    const deleteFile = (name) => {
        setModalDelete(true);
        setName(name);
    };

    const removeCase = (file) => {
        if (file.url) {
            deleteEvidence(file.url)
                .then((response) => {
                    props.setUpdateCase(response);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setModalDelete(false);
                });
        } else {
            props.removeFile(props.index);
            setModalDelete(false);
        }
    };

    return (
        <>
            <ModalConfirm type='delete' component='Evidencia' name={`La evidencia ${name} `} showModal={modalDelete} onHide={() => setModalDelete(false)} ifConfirm={() => removeCase(props.file)} />
            <Card className="flex-fill">
                <Card.Body className="d-flex align-items-center">
                    <div className="mr-auto">
                        <Button
                            className='text-capitalize'
                            variant='light'
                            title={'Evidencia ' + props.index}
                            onClick={openFile}
                            disabled={props.file.url == null ? true : false}
                            size="sm">
                            <i className="fas fa-external-link-alt" />
                            <p>Nombre: {props.file.original_filename || props.file.name}</p>
                            <p>Mime: {props.file.mime || props.file.type}</p>
                            <p>Tamaño: {props.file.size}</p>
                            <p>Fecha de creación: {props.file.created ? props.file.created.slice(0, 10) + " " + props.file.created.slice(11, 19) : "" || "No creado en el sistema"}</p>
                        </Button>
                    </div>
                    {props.disableDelete?
                    ""
                    :
                    <Button
                        size='sm'
                        className='btn-icon btn-rounded ml-3'
                        variant='outline-danger'
                        title={'Eliminar evidencia ' + props.index}
                        onClick={() => deleteFile(props.file.original_filename || props.file.name)}>
                        <i className='fas fa-trash-alt' />
                    </Button>
                    }
                </Card.Body>
            </Card>
        </>
    );
};

export default ViewFiles;
