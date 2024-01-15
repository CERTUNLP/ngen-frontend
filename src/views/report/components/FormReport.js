import React from 'react'
import { Button, Row, Form, Spinner, Col} from 'react-bootstrap';


const FormReport = ({body, setBody, taxonomies, createOrEdit}) => {

    const completeField=(event)=>{ 
        setBody({...body,
            [event.target.name] : event.target.value}
        )       
    };
    
  return (
      <Form>
        <Row>
            <Col sm={12} lg={4}>
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Problema <b style={{color:"red"}}>*</b></Form.Label>
                    <Form.Control 
                        name="problem" 
                        value ={body.problem} 
                        maxlength="150" 
                        placeholder="Ingrese el problema" 
                        onChange={(e)=>completeField(e)}
                        />
                </Form.Group>
            </Col>      
            <Col sm={12} lg={4}>
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Problema derivado <b style={{color:"red"}}>*</b></Form.Label>
                    <Form.Control 
                        name="derived_problem" 
                        value ={body.derived_problem} 
                        maxlength="150" 
                        placeholder="Ingrese el Problema derivado" 
                        onChange={(e)=>completeField(e)}
                        />
                </Form.Group>
            </Col>      
            <Col sm={12} lg={4}>
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Verificación <b style={{color:"red"}}>*</b></Form.Label>
                    <Form.Control 
                        name="verification" 
                        value ={body.verification} 
                        maxlength="150" 
                        placeholder="Ingrese la verificación" 
                        onChange={(e)=>completeField(e)}
                        />
                </Form.Group>
            </Col>
            <Col sm={12} lg={4}>
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Recomendaciones <b style={{color:"red"}}>*</b></Form.Label>
                    <Form.Control 
                        name="recommendations" 
                        value ={body.recommendations} 
                        maxlength="150" 
                        placeholder="Ingrese las recomendaciones" 
                        onChange={(e)=>completeField(e)}
                        />
                </Form.Group>
            </Col>      
            <Col sm={12} lg={4}>
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Mas información <b style={{color:"red"}}>*</b></Form.Label>
                    <Form.Control 
                        name="more_information" 
                        value ={body.more_information} 
                        maxlength="150" 
                        placeholder="Ingrese mas informacion" 
                        onChange={(e)=>completeField(e)}
                        />
                </Form.Group>
            </Col>
            <Col sm={12} lg={4}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Taxonomia<b style={{color:"red"}}>*</b></Form.Label>
                <Form.Control  
                    type="choice"
                    as="select" 
                    name="taxonomy" 
                    value ={body.taxonomy} 
                    onChange={(e)=>completeField(e)} >
                    <option value="-1">Seleccione una taxonomia</option>
                    {taxonomies.map((taxonomy) => {
                        return(<option value={taxonomy.url}> {taxonomy.name} </option>)
                    })}
                </Form.Control>
                </Form.Group>
            </Col> 
            <Col sm={12} lg={4}>
                <Form.Group controlId="Form.Network.Type">
                    <Form.Label>Lenguaje </Form.Label>
                    <Form.Control
                        name="lang"
                        type="choice"
                        as="select"
                        value={body.lang}
                        onChange={(e) =>  completeField(e)}>
                        <option key={0} value=''>Seleccione el lenguaje</option>
                        <option key={1} value='en'>Ingles</option>
                        <option key={2} value='es'>Español</option>                                
                    </Form.Control>
                </Form.Group>
            </Col>     
        </Row>
        
           
            <><Button variant="primary" onClick={createOrEdit}>Guardar</Button></> 
            <Button variant="primary" href="/reports">Cancelar</Button>
        
        
    </Form>
  )
}

export default FormReport