import React, { useEffect, useState } from 'react';
import {Button, Col, Row, Form} from 'react-bootstrap';
import Select from 'react-select';



const FormCreateEdge = ({body, setBody, selectChild, setSelectChild, childernes, ifConfirm, ifCancel}) => {

  const messageToPlaceholder = "Seleccione una opción"
  const messageWithoutOptions = "No hay opciones"
  
  const completeChildernes=(event)=>{ 

   if(event){
    setBody({...body,
        ["child"] : event.value}
    )
    setSelectChild(event)

   }else{
    setSelectChild("")

   }
        
    
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
              <Col>
              
                <Form.Group controlId="formGridAddress1">
                        <Form.Label>Nombre de la transición<b style={{color:"red"}}>*</b></Form.Label>
                        <Form.Control 
                            placeholder="Ingrese discriminador" 
                            maxlength="150" 
                            value ={body.discr} 
                            name="discr"           
                            onChange={(e)=>completeField(e)}
                        />
                        {/*validateDescription(body.description) ? '' : <div className="invalid-feedback">Ingrese una descripcion que contenga hasta 250 caracteres y que no sea vacía</div>*/}
                </Form.Group>
            </Col>
            <Col>
                
                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Estado siguiente <b style={{color:"red"}}>*</b></Form.Label>
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
            </Col>
            </Row>
            <Row className="justify-content-center">
                <Form.Group>
                { body.discr.trim() !=="" && selectChild !=="" ?  
                <><Button variant="primary" onClick={ifConfirm} >Guardar</Button></>
                :<><Button variant="primary" disabled>Guardar</Button></> }
                    
                
                    <Button variant="primary" onClick={ifCancel}>Cancelar</Button>
                </Form.Group>
            </Row>
          </Form>
          
      </React.Fragment>
  );
}

export default FormCreateEdge