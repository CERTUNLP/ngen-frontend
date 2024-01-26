import React, { useEffect, useState } from 'react';
import {Button, Col, Row, Form} from 'react-bootstrap';
import Select from 'react-select';



const FormCreateEdge = ({body, setBody, selectChild, setSelectChild, childernes, ifConfirm, ifCancel}) => {

  const messageToPlaceholder = "Seleccione una opción"
  const messageWithoutOptions = "No hay opciones"
  
  const completeChildernes=(event)=>{ 

    console.log(event)
        
    setBody({...body,
        ["child"] : event.value}
    )
    setSelectChild(event)
}

const completeField=(event)=>{ 
    setBody({...body,
        [event.target.name] : event.target.value}
    )     
}
  
  
  return (
      <React.Fragment>
          <Form>
              <Row>
                <Form.Group controlId="formGridAddress1">
                        <Form.Label>Nombre de la transición </Form.Label>
                        <Form.Control 
                            placeholder="Ingrese discriminador" 
                            maxlength="150" 
                            value ={body.discr} 
                            name="discr"           
                            onChange={(e)=>completeField(e)}
                        />
                        {/*validateDescription(body.description) ? '' : <div className="invalid-feedback">Ingrese una descripcion que contenga hasta 250 caracteres y que no sea vacía</div>*/}
            
                </Form.Group>
            </Row>
            <Row>  
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Hijo</Form.Label>
                    <Select
                        value={selectChild} 
                        isClearable
                        defaultValue={body.child}
                        placeholder={messageToPlaceholder}
                        noOptionsMessage={()=>messageWithoutOptions}
                        onChange={completeChildernes}
                        options={childernes}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Form.Group>
                    <><Button variant="primary" onClick={ifConfirm} >Guardar</Button></>
                
                    <Button variant="primary" onClick={ifCancel}>Cancelar</Button>
                </Form.Group>
            </Row>
          </Form>
          
      </React.Fragment>
  );
}

export default FormCreateEdge