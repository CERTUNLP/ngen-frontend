import {Card, Form, Button, Row, Col} from 'react-bootstrap'
import makeAnimated from 'react-select/animated';
import { validateName, validateDescription, validateUnrequiredInput } from '../../../utils/validators/state';


const animatedComponents = makeAnimated();


const FormState = ({body, setBody, createState, type}) => {
    

    const completeField=(event)=>{ 
        setBody({...body,
            [event.target.name] : event.target.value}
        )     
    } 
   

  return (
    <div>
        <Card>
            <Card.Header>
                <Card.Title as="h5">{type} Estado</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Nombre <b style={{color:"red"}}>*</b></Form.Label>
                                <Form.Control 
                                    placeholder="Ingrese un nombre" 
                                    maxlength="100" 
                                    value ={body.name} 
                                    name="name"
                                    isInvalid={!validateName(body.name)}                        
                                    onChange={(e)=>completeField(e)}
                                />
                                {validateName(body.name) ? '' : <div className="invalid-feedback">Ingrese un nombre que contenga hasta 100 caracteres, solo letras y que no sea vacio</div>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Atendido</Form.Label>
                                <Form.Control  
                                    type="choice"
                                    as="select" 
                                    name="attended" 
                                    value ={body.attended}                          
                                    onChange={(e)=>completeField(e)}>
                                    <option value={true}>Verdadero</option>
                                    <option value={false}>Falso</option>       
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Resuelto</Form.Label>
                                <Form.Control  
                                    type="choice"
                                    as="select" 
                                    name="solved" 
                                    value ={body.solved} 
                                    onChange={(e)=>completeField(e)}>
                                    <option value={true}>Verdadero</option>
                                    <option value={false}>Falso</option>       
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            placeholder="Ingrese una descripcion" 
                            maxlength="150" 
                            value ={body.description} 
                            name="description"
                            isInvalid={(validateUnrequiredInput(body.description)) ? !validateDescription(body.description) : false}                
                            onChange={(e)=>completeField(e)}
                        />
                        {validateDescription(body.description) ? '' : <div className="invalid-feedback">Ingrese una descripcion que contenga hasta 250 caracteres y que no sea vacía</div>}
                    </Form.Group>

                   
                    {body.name !== "" && validateName(body.name) ?
                    <Button variant="primary" onClick={createState} >Guardar</Button>                             
                    : 
                    <Button variant="primary" disabled>Guardar</Button>                                    
                }
                    
                    <Button variant="primary" href="/states">Cancelar</Button>  

                </Form>
            </Card.Body>
        </Card>
        
    </div>
  )
}

export default FormState