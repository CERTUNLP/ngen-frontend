import React, { useEffect, useState } from 'react';
import { Button, Card, CloseButton, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ViewFiles from '../../components/Button/ViewFiles';
import SmallEventTable from '../event/components/SmallEventTable';
import { getCase } from '../../api/services/cases';
import apiInstance from "../../api/api.js";
import { getEvent } from "../../api/services/events";
import { getEvidence } from '../../api/services/evidences';
import EvidenceCard from '../../components/UploadFiles/EvidenceCard';


const ReadCase = () => {
    const location = useLocation();
    const [caseItem, setCaseItem] = useState(location?.state?.item || null);
    const [navigationRow, setNavigationRow] = useState(localStorage.getItem('navigation'));
    const [buttonReturn, setButtonReturn] = useState(localStorage.getItem('button return'));

    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [attend_date, setAttend_Date] = useState('');
    const [solve_date, setSolve_Date] = useState('');
    const [created, setCreated] = useState('');
    const [modified, setModified] = useState('');

    const [assigned, setAssigned] = useState('');
    const [priority, setPriority] = useState('');
    const [tlp, setTlp] = useState('');
    const [state, setState] = useState('');

    const [modalShowEvent, setModalShowEvent] = useState(false);

    const [list, setList] = useState([]);
    
    const [evidences, setEvidences] = useState([]);

    useEffect(() => {

        if (caseItem !== null) {
            const eventPromises = caseItem.events.map(url => getEvent(url));

            Promise.all(eventPromises)
                .then(responses => {
                    // Todas las llamadas se han completado exitosamente
                    const eventsData = responses.map(response => response.data);
                    setList(eventsData);
                })
                .catch(error => {
                    // Maneja cualquier error que ocurra durante las llamadas
                    console.error("Error al obtener eventos:", error);
                });
        }
        if (!caseItem) {
            const caseUrl = localStorage.getItem('case');
            console.log("STORAGE")
            getCase(caseUrl)
                .then((response) => {
                    setCaseItem(response.data)
                }).catch(error => console.log(error));

        }

        const getEvidenceFile = (url) => {
            return apiInstance.get(url)
                .then(response => {
                    return response.data.file;
                }).catch(error => {
                    console.log(error)
                })
        }

        const getName = (url, set) => {
            return apiInstance.get(url)
                .then(response => {
                    set(response.data.name);
                }).catch(error => {
                    console.log(error)
                })
        }
        const getAssignedUser = (url) => {
            return apiInstance.get(url)
                .then(response => {
                    setAssigned(response.data.username);
                }).catch(error => {
                    console.log(error)
                })
        }
        const formatDate = (dateTime, set) => { //2023-09-11T17:14:20.292538Z
            let date = dateTime.split('T')
            set(date[0] + ' ' + date[1].slice(0, 8));
        }

        if (caseItem) {
            if (caseItem.evidence.length > 0) {// aca esta el error en los read
                getEvidenceFile(caseItem.evidence).then(r => console.log(r))
            }
            getName(caseItem.priority, setPriority);
            getName(caseItem.tlp, setTlp);
            if (caseItem.user_creator) {
                getAssignedUser(caseItem.user_creator);
            } else {
                setAssigned('No asignado')
            }
            getName(caseItem.state, setState);

            let idItem = caseItem.url.split('/')[(caseItem.url.split('/')).length - 2]
            setId(idItem)

            let datetime = caseItem.created.split('T');
            setCreated(datetime[0] + ' ' + datetime[1].slice(0, 8))
            datetime = caseItem.modified.split('T');
            setModified(datetime[0] + ' ' + datetime[1].slice(0, 8))

            if (caseItem.date) {
                formatDate(caseItem.date, setDate)
            }
            if (caseItem.attend_date) {
                formatDate(caseItem.attend_date, setAttend_Date)
            }
            if (caseItem.solve_date) {
                formatDate(caseItem.solve_date, setSolve_Date)
            }
        }
    }, [caseItem]);

    useEffect(() => {

        const fetchAllEvidences = async () => {
            try {
                // Esperar a que todas las promesas de getEvidence se resuelvan
                const responses = await Promise.all(caseItem.evidence.map((url) => getEvidence(url)));
                // Extraer los datos de las respuestas
                const data = responses.map(response => response.data);
                // Actualizar el estado con los datos de todas las evidencias
                setEvidences(data);
                
            } catch (error) {
                console.error("Error fetching evidence data:", error);
            }
        };

        // Llamar a la función para obtener los datos de las evidencias
        fetchAllEvidences();
    }, [caseItem]);

    return (
        caseItem &&
        <React.Fragment>
            {navigationRow !=="false" ? 
            <Row>
                <Navigation actualPosition="Detalle" path="/cases" index="Casos" />
            </Row>
            :" "
            }
            <Row>
                <Col sm={12}>

                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Principal</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive >
                                <tbody>
                                    <tr>
                                        <td>Id del sistema</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={id} />
                                        </td>
                                        <td>Prioridad</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={priority} />
                                        </td>
                                        <td>TLP</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={tlp} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ciclo de vida</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={caseItem.lifecycle} />
                                        </td>
                                        <td>Estado</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={state} />
                                        </td>
                                        <td>Asignado</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={assigned} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Nombre</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={caseItem.name ? caseItem.name : "-"} />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Fechas</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive >
                                <tbody>
                                    <tr>
                                        <td>Fecha de inicio de gestión</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={date} />
                                        </td>
                                        <td>Atencion</td>
                                        {caseItem.attend_date ?
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue={attend_date} />
                                            </td>
                                            :
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue='No atendido' />
                                            </td>
                                        }

                                        <td>Resolucion</td>
                                        {caseItem.solve_date ?
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue={solve_date} />
                                            </td>
                                            :
                                            <td>
                                                <Form.Control plaintext readOnly defaultValue='No resuelto' />
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td>Creacion</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={created} />
                                        </td>
                                        <td>Modificacion</td>
                                        <td>
                                            <Form.Control plaintext readOnly defaultValue={modified} />
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <EvidenceCard evidences={evidences} disableDelete={true} disableDragAndDrop={true}/>
                    
                    <SmallEventTable list={list} disableLink={true}/>


                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Informacion Adicional</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={6} lg={3}>
                                    Comentarios
                                </Col>
                                <Col>
                                    <Form.Control plaintext readOnly defaultValue={caseItem.comments} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {caseItem.children.length > 0 ?
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Children</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={6} lg={3}>Children</Col>
                                    <Col>
                                        <Form.Control plaintext readOnly defaultValue={caseItem.children} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        : <></>}


                    {buttonReturn  !=="false" ?
                        <Button variant="primary" href="/cases">Volver</Button>
                    : 
                    ""
                    }
                    
                </Col>
            </Row>

            <Modal size='lg' show={modalShowEvent} onHide={() => setModalShowEvent(false)} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col>
                                            <Card.Title as="h5">Evento</Card.Title>
                                            <span className="d-block m-t-5">Detalle de Evento</span>
                                        </Col>
                                        <Col sm={12} lg={4}>
                                            <CloseButton aria-label='Cerrar' onClick={() => setModalShowEvent(false)} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>Informacion del evento</Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ReadCase;
