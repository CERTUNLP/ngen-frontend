import React, { useState, useRef, useEffect } from 'react'
import { Button, Row, Form, Col } from 'react-bootstrap';


const FormReport = ({ body, setBody, taxonomies, createOrEdit }) => {
    const textareaRefs = {
        problem: useRef(null),
        derived_problem: useRef(null),
        verification: useRef(null),
        recommendations: useRef(null),
        more_information: useRef(null)
    };

    const [maxHeights, setMaxHeights] = useState({
        problem: 'auto',
        derived_problem: 'auto',
        verification: 'auto',
        recommendations: 'auto',
        more_information: 'auto'
    });

    const completeField = (event) => {
        setBody({
            ...body,
            [event.target.name]: event.target.value
        }
        )
    };
    // Función para actualizar la altura máxima del div visualizador
    const updateMaxHeight = (key) => {
        const textareaHeight = textareaRefs[key].current.clientHeight;
        setMaxHeights(prevState => ({
            ...prevState,
            [key]: textareaHeight + 'px'
        }));
    };

    // Manejar el cambio de tamaño de cada textarea
    useEffect(() => {
        Object.keys(textareaRefs).forEach(key => {
            updateMaxHeight(key);
            window.addEventListener('resize', () => updateMaxHeight(key)); // Escuchar al evento resize para cada textarea
        });

        return () => {
            Object.keys(textareaRefs).forEach(key => {
                window.removeEventListener('resize', () => updateMaxHeight(key)); // Limpiar el event listener al desmontar el componente
            });
        };
    }, []); // Ejecutar una sola vez al montar el componente

    return (
        <Form>
            <Row>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Taxonomia<b style={{ color: "red" }}>*</b></Form.Label>
                        <Form.Control
                            type="choice"
                            as="select"
                            name="taxonomy"
                            value={body.taxonomy}
                            onChange={(e) => completeField(e)} >
                            <option value="-1">Seleccione una taxonomia</option>
                            {taxonomies.map((taxonomy) => {
                                return (<option value={taxonomy.url}> {taxonomy.name} </option>)
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="Form.Network.Type">
                        <Form.Label>Idioma <b style={{ color: "red" }}>*</b></Form.Label>
                        <Form.Control
                            name="lang"
                            type="choice"
                            as="select"
                            value={body.lang}
                            onChange={(e) => completeField(e)}>
                            <option key={0} value=''>Seleccione el lenguaje</option>
                            <option key={1} value='en'>Ingles</option>
                            <option key={2} value='es'>Español</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Problema <b style={{ color: "red" }}>*</b></Form.Label>
                        <Form.Control
                            as="textarea"
                            name="problem"
                            value={body.problem}
                            placeholder="Ingrese el problema"
                            onChange={(e) => completeField(e)}
                            ref={textareaRefs.problem}
                            onInput={() => updateMaxHeight('problem')}
                        />
                        <span style={{ color: "gray", fontSize: "0.8em" }}>El texto ingresado se parseará como código HTML.</span>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Label>Vista previa problema</Form.Label>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            maxHeight: maxHeights.problem, // Altura máxima igual a la altura actual del textarea
                            overflowY: "auto",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px"
                        }}
                        dangerouslySetInnerHTML={{ __html: body.problem }}
                    />
                </Col>

                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Problema derivado</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="derived_problem"
                            value={body.derived_problem}
                            placeholder="Ingrese el Problema derivado"
                            onChange={(e) => completeField(e)}
                            ref={textareaRefs.derived_problem}
                            onInput={() => updateMaxHeight('derived_problem')}
                        />
                        <span style={{ color: "gray", fontSize: "0.8em" }}>El texto ingresado se parseará como código HTML.</span>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Label>Vista previa problema derivado</Form.Label>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            maxHeight: maxHeights.derived_problem, // Altura máxima igual a la altura actual del textarea
                            maxHeight: "200px",
                            overflowY: "auto",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px"
                        }}
                        dangerouslySetInnerHTML={{ __html: body.derived_problem }}
                    />
                </Col>

                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Verificación</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="verification"
                            value={body.verification}
                            placeholder="Ingrese la verificación"
                            onChange={(e) => completeField(e)}
                            ref={textareaRefs.verification}
                            onInput={() => updateMaxHeight('verification')}
                        />
                        <span style={{ color: "gray", fontSize: "0.8em" }}>El texto ingresado se parseará como código HTML.</span>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Label>Vista previa verificación</Form.Label>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            maxHeight: maxHeights.verification, // Altura máxima igual a la altura actual del textarea
                            maxHeight: "200px",
                            overflowY: "auto",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px"
                        }}
                        dangerouslySetInnerHTML={{ __html: body.verification }}
                    />
                </Col>

                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Recomendaciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="recommendations"
                            value={body.recommendations}
                            placeholder="Ingrese las recomendaciones"
                            onChange={(e) => completeField(e)}
                            ref={textareaRefs.recommendations}
                            onInput={() => updateMaxHeight('recommendations')}
                        />
                        <span style={{ color: "gray", fontSize: "0.8em" }}>El texto ingresado se parseará como código HTML.</span>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Label>Vista previa recomendaciones</Form.Label>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            maxHeight: maxHeights.recommendations, // Altura máxima igual a la altura actual del textarea
                            maxHeight: "200px",
                            overflowY: "auto",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px"
                        }}
                        dangerouslySetInnerHTML={{ __html: body.recommendations }}
                    />
                </Col>

                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Más información</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="more_information"
                            value={body.more_information}
                            placeholder="Ingrese mas informacion"
                            onChange={(e) => completeField(e)}
                            ref={textareaRefs.more_information}
                            onInput={() => updateMaxHeight('more_information')}
                        />
                        <span style={{ color: "gray", fontSize: "0.8em" }}>El texto ingresado se parseará como código HTML.</span>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={6}>
                    <Form.Label>Vista previa más información</Form.Label>
                    <div
                        style={{
                            backgroundColor: "white",
                            color: "black",
                            maxHeight: maxHeights.more_information, // Altura máxima igual a la altura actual del textarea
                            overflowY: "auto",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "20px"
                        }}
                        dangerouslySetInnerHTML={{ __html: body.more_information }}
                    />
                </Col>

            </Row>



            {body.problem !== "" & body.lang !== "" & body.taxonomy !== "-1" ?
                <Button variant="primary" onClick={createOrEdit}>Guardar</Button>
                :
                <><Button variant="primary" disabled>Guardar</Button></>
            }
            <Button variant="primary" href="/reports">Cancelar</Button>


        </Form>
    )
}

export default FormReport