import React,{useState, useEffect} from 'react'
import {Card, Form, Button,Row, Col} from 'react-bootstrap'
import { postStringIdentifier } from "../../../api/services/stringIdentifier";
import SelectComponent from '../../../components/Select/SelectComponent';

const FormTemplate = (props) => {

  const lifeCicle= [
      {
          value :"manual",
          label :"Manual"
      },
      {
          value :"auto",
          label :"Auto"
      },
      {
        value:"auto_open",
        label:"auto_open"
      },
      {
          value:"auto_close",
          label: "auto_close"
      }
      
      
    ]
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  const [selectPriority, setSelectPriority] = useState()
  const [selectTlp, setSelectTlp] = useState()
  const [selectTaxonomy, setSelectTaxonomy] = useState()
  const [selectFeed, setSelectFeed] = useState()
  const [selectState, setSelectState] = useState()
  const [selectLifeCicle, setSelectLifeCicle] = useState()

  useEffect(()=> {
        
    if (props.tlp !== []) {
        props.tlp.forEach(item => {
            if(item.value === props.body.case_tlp){
                setSelectTlp({label:item.label, value:item.value })
            }
        });
    }
    if (props.taxonomy !== []) {
        props.taxonomy.forEach(item => {
            if(item.value === props.body.event_taxonomy){
                setSelectTaxonomy({label:item.label, value:item.value })
            }
        });
    }
    if (props.feeds !== []) {
        props.feeds.forEach(item => {
            if(item.value === props.body.event_feed){
                setSelectFeed({label:item.label, value:item.value })
            }
        });
    }
    if (props.priorities !== []) {
        props.priorities.forEach(item => {
            if(item.value === props.body.priority){
                setSelectPriority({label:item.label, value:item.value })
            }
        });
    }
    if (props.states !== []) {
        props.states.forEach(item => {
            if(item.value === props.body.case_state){
                setSelectState({label:item.label, value:item.value })
            }
        });
    }
    if (lifeCicle !== []) {
        lifeCicle.forEach(item => {
            if(item.value === props.body.case_lifecycle){
                setSelectLifeCicle({label:item.label, value:item.value })
            }
        });
    }

},[props.priorities, props.states, props.tlp, props.taxonomy, props.feeds])

  const completeField=(event)=>{ 
    props.setBody({...props.body,
        [event.target.name] : event.target.value}
    )    
  }

  const completeFieldStringIdentifier=(event)=>{ 
       
    if (event.target.value !==""){ 
        postStringIdentifier(event.target.value).then((response) => { 
            console.log(response.data.artifact_type)
            console.log(event.target.value)
            setShowErrorMessage(response.data.artifact_type === "OTHER" )        
        })
        .catch((error) => {
            console.log(error)
        }).finally(() => {
            console.log("finalizo")
        })   
    }

    if (event.target.value === "" ){
        setShowErrorMessage(false)//para que no aparesca en rojo si esta esta el input vacio en el formulario
    }   
    props.setBody({...props.body,[event.target.name] : event.target.value}) 
  }

  const completeField1=( nameField,event, setOption)=>{ 
    if (event){
        props.setBody({...props.body,
            [nameField] :event.value }
        )
    }else{
        props.setBody({...props.body,
            [nameField] :"" }
        )
    }
    setOption(event)
  };

  return (
    <React.Fragment>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Ante un evento</Card.Title>
            </Card.Header>
      <Card.Body>
        <Form>
        <Row>
              <Col sm={12} lg={4}>
                <SelectComponent controlId="exampleForm.ControlSelect1" label="Taxonomia" options={props.taxonomy} value={selectTaxonomy} nameField="event_taxonomy" 
                                        onChange={completeField1} placeholder="Seleccione una taxonomia" setOption={setSelectTaxonomy} required={true}/>
              </Col>            
              <Col sm={12} lg={4}>
                <SelectComponent controlId="exampleForm.ControlSelect1" label="Fuente de Informacion" options={props.feeds} value={selectFeed} nameField="event_feed"
                                            onChange={completeField1} placeholder="Seleccione una Fuente de Informacion" setOption={setSelectFeed} required={true}/>
              </Col>
           
            </Row>
            </Form>
            </Card.Body>
        </Card>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Recursos afectados</Card.Title>
            </Card.Header>
           <Card.Body>
            <Form.Label>CIDR, Domino o Email<b style={{color:"red"}}>*</b></Form.Label>
                <Row>
                <Col sm={12} lg={6}>
                    <Form.Group controlId="formGridAddress1">
                    <Form.Control 
                        placeholder="Ingrese IPv4,IPv6, Nombre de domino o Email" 
                        maxlength="150" 
                        value ={props.body.address_value} 
                        onChange={(e)=>completeFieldStringIdentifier(e)}
                        isInvalid={showErrorMessage }
                        name="address_value"/>
                        {showErrorMessage    ?  <div className="invalid-feedback"> Debe ingresar IPv4,IPv6, Nombre de domino o Email</div>  : "" }
                    </Form.Group> 
                </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Crear un caso</Card.Title>
            </Card.Header>
            <Card.Body>  
        <Form>
            <Row>
                <Col sm={12} lg={4}>
            
                    <SelectComponent controlId="exampleForm.ControlSelect1" label="TLP" options={props.tlp} value={selectTlp} nameField="case_tlp"
                                        onChange={completeField1} placeholder="Seleccione un tlp" setOption={setSelectTlp} required={true}/>
               </Col>
              <Col sm={12} lg={4}>
                    <SelectComponent controlId="exampleForm.ControlSelect1" label="Prioridades" options={props.priorities} value={selectPriority} nameField="priority"
                                     onChange={completeField1} placeholder="Seleccione una Prioridad" setOption={setSelectPriority} required={true}/>
              </Col>
              <Col sm={12} lg={4}>
                <SelectComponent controlId="exampleForm.ControlSelect1" label="Estados" options={props.states} value={selectState} nameField="case_state"
                                     onChange={completeField1} placeholder="Seleccione una Estado" setOption={setSelectState} required={true}/>
              </Col>
              </Row>
              <Row>
              <Col sm={12} lg={4}>
              
                <SelectComponent controlId="exampleForm.ControlSelect1" label="Ciclo de vida" options={lifeCicle} value={selectLifeCicle} nameField="case_lifecycle"
                                     onChange={completeField1} placeholder="Seleccione una Ciclo de vida" setOption={setSelectLifeCicle} required={true}/>
              </Col>
              </Row>
        </Form>                  
      </Card.Body>
      </Card>
      { props.body.event_taxonomy !== '-1' && props.body.event_feed !== '-1' && props.body.case_tlp !== "-1"
      && props.body.priority !== "-1" && props.body.case_state !== "-1" && props.body.address_value !== "" && !showErrorMessage ?
            <Button variant="primary" onClick={props.createTemplate} >Guardar</Button> 
            : 
            <Button variant="primary" disabled>Guardar</Button>                                    
    }
    
    <Button variant="primary" href="/templates">Cancelar</Button>       
         
    </React.Fragment>
  )
}

export default FormTemplate