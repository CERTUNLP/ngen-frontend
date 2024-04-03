
import React,{useState, useEffect} from 'react'
import {Card, Form, Button, Row, Col} from 'react-bootstrap'
import makeAnimated from 'react-select/animated';
import { validateName, validateDescription, validateUnrequiredInput } from '../../../utils/validators/state';
import SelectComponent from '../../../components/Select/SelectComponent';

const animatedComponents = makeAnimated();
const FormState = ({body, setBody, createState, type}) => {
    const [selectAttended, setSelecAttended] = useState()
    const [selectSolved, setSelectSolved] = useState()
    let solvedOptions = [
        {
            value : true,
            label : "Verdadero"
        },
        {
            value : false,
            label : "Falso"
        }
    ]
    let attendedOptions = [
        {
            value : true,
            label : "Verdadero"
        },
        {
            value : false,
            label : "Falso"
        }
    ]
    useEffect(()=> {
        
        if (solvedOptions !== []) {
            solvedOptions.forEach(item => {
                if(item.value === body.solved){
                    setSelectSolved({label:item.label, value:item.value })
                }
            });
        }
        if (attendedOptions !== []) {
            attendedOptions.forEach(item => {
                if(item.value === body.attended){
                    setSelecAttended({label:item.label, value:item.value })
                }
            });
        }
       
    
    },[])

    const completeField=(event)=>{ 
        setBody({...body,
            [event.target.name] : event.target.value}
        )     
    } 

    const completeField1=( nameField,event, setOption)=>{ 
        if (event){
            setBody({...body,
                [nameField] :event.value }
            )
        }else{
            setBody({...body,
                [nameField] :"" }
            )
        }
        setOption(event)
    };
   

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
                            <SelectComponent controlId="exampleForm.ControlSelect1" label="Atendido" options={attendedOptions} value={selectAttended} nameField="attended"
                                        onChange={completeField1} placeholder="Seleccione una opcion" setOption={setSelecAttended} required={true}/>
                        </Col>
                        <Col>
                            <SelectComponent controlId="exampleForm.ControlSelect1" label="Resuelto" options={attendedOptions} value={selectSolved} nameField="solved"
                                        onChange={completeField1} placeholder="Seleccione una opcion" setOption={setSelectSolved} required={true}/>
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

                   
                    {body.name !== "" && validateName(body.name) && body.attended !== "" && body.solved !== ""?
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