import React, { useEffect, useState } from 'react';
import {Button, Col, Row, Form} from 'react-bootstrap';
import { validateName, validateContact, validateSelect } from '../../../utils/validators/contact'; 
import FormContactSelectUsername from './FormContactSelectUSername';
import { getMinifiedPriority } from '../../../api/services/priorities';
import SelectLabel from '../../../components/Select/SelectLabel';

const FormCreateContact = (props) => { 
    // props: name, setName, role, setRole, priority, setPriority, type, setType, contact, setContact, keypgp, setKey, ifConfirm, ifCancel
    const [validContact, setValidContact] = useState(false) 
    const [prioritiesOption, setPrioritiesOption] = useState([])

    const [selectPriority, setSelectPriority] = useState()
    const [selectRole, setSelectRole] = useState()
    const [selectType, setSelectType] = useState()

    useEffect(()=> {

        getMinifiedPriority()
            .then((response) => {
                let listPriority = []
                response.map((priority) => {
                    listPriority.push({value:priority.url, label:priority.name})
                })
                setPrioritiesOption(listPriority)
            })
            .catch((error)=>{
                console.log(error)
            })

    },[])

    useEffect(()=> {
        if (prioritiesOption !== []) {
            prioritiesOption.forEach(item => {
                if(item.value === props.priority){
                    setSelectPriority({label:item.label, value:item.value })
                }
            });
        }
        if (roleOptions !== []) {
            roleOptions.forEach(item => {
                if(item.value === props.role){
                    setSelectRole({label:item.label, value:item.value })
                }
            });
        }
        if (typeOptions !== []) {
            typeOptions.forEach(item => {
                if(item.value === props.type){
                    setSelectType({label:item.label, value:item.value })
                }
            });
        }


    },[prioritiesOption])
    
    const roleOptions = [
        {
            value : 'technical',
            label : 'Tecnico'
        },
        {
            value : 'administrative',
            label : 'Administrativo'
        },
        {
            value : 'abuse',
            label : 'Abuso'
        },
        {
            value : 'notifications',
            label : 'Notificaciones'
        },
        {
            value : 'noc',
            label : 'NOC'
        }
    ]

    const typeOptions = [
        {
            value : 'email',
            label : 'Correo Electronico'
        },
        {
            value : 'telegram',
            label : 'Telegram'
        },
        {
            value : 'phone',
            label : 'Telefono'
        },
        {
            value : 'uri',
            label : 'URI'
        },
    ]

    return (
        <React.Fragment>
            <Form>
                <Row>
                    <Col sm={12} lg={4}>
                        <Form.Group controlId="Form.Contact.Name">
                            <Form.Label>Nombre <b style={{color:"red"}}>*</b></Form.Label>
                            <Form.Control 
                                type="nombre" 
                                placeholder="Nombre" 
                                maxlength="100"
                                value={props.name} 
                                onChange={(e) => props.setName(e.target.value)} 
                                isInvalid={!validateName(props.name)}                                
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectLabel set={props.setRole} setSelect={setSelectRole} options={roleOptions}
                                    value={selectRole} placeholder="Rol" required={true}/>
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectLabel set={props.setPriority} setSelect={setSelectPriority} options={prioritiesOption}
                                    value={selectPriority} placeholder="Prioridad" required={true}/>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <SelectLabel set={props.setType} setSelect={setSelectType} options={typeOptions}
                                    value={selectType} placeholder="Tipo" required={true}/>
                    </Col>
                    <Col lg={8}>
                        <FormContactSelectUsername selectedType={props.type} 
                            contact={props.contact} setContact={props.setContact}
                            setValidContact={setValidContact} />
                    </Col>
                </Row>
                <Form.Group controlId="Form.Contact.Key">
                    <Form.Label>Clave publica</Form.Label>
                    <Form.Control 
                        type="string"
                        placeholder="Llave pública PGP"
                        value={props.keypgp}
                        maxlength="100"
                        onChange = {(e) =>  {props.setKey(e.target.value)}} />
                </Form.Group>
                <Form.Group>
                    {props.name !== ""&& (validateName(props.name) && validateSelect(props.role) && validateSelect(props.priority) && validateSelect(props.type) && validateContact(props.contact) && (validContact)) ? 
                        <><Button variant="primary" onClick={props.ifConfirm} >Guardar</Button></>
                        : 
                        <><Button variant="primary" disabled>Guardar</Button></>                         
                    }
                        <Button variant="primary" onClick={props.ifCancel}>Cancelar</Button>
                </Form.Group>
            </Form>
        </React.Fragment>
    );
};
            
export default FormCreateContact;
