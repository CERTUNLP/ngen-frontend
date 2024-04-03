import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import DropdownState from '../../components/Dropdown/DropdownState'
import { useLocation } from "react-router-dom";
import Select from 'react-select';
import Alert from '../../components/Alert/Alert';
import Navigation from '../../components/Navigation/Navigation'
import { validateName, validateDescription, validateType, validateUnrequiredInput } from '../../utils/validators/taxonomy';
import { putTaxonomy, getTaxonomy, getMinifiedTaxonomy } from '../../api/services/taxonomies';
import SelectLabel from '../../components/Select/SelectLabel';


const EditTaxonomy = () => {
    const location = useLocation();
    const fromState = location.state;
    const [taxonomy, setTaxonomy] = useState(fromState);  

    const [type, setType] = useState(taxonomy.type);
    const [name, setName] = useState(taxonomy.name);    
    const [description, setDescription] = useState(taxonomy.description);
    const [parent, setParent] = useState(taxonomy.parent);
    const [active, setActive] = useState(+taxonomy.active);
    const [taxonomies, setTaxonomies] = useState([]);      
    const [currentParent, setCurrentParent] = useState("")
    const [showAlert, setShowAlert] = useState(false) 

    const [selectTaxonomy, setSelectTaxonomy] = useState()
    const [selectedType, setSelectedType] = useState()

    useEffect(() => {                 
        getMinifiedTaxonomy()
        .then((response) => {
            let listTaxonomies = []
            listTaxonomies.push({value:"", label:"Sin padre"})
            response.map((taxonomy) => {
                listTaxonomies.push({value:taxonomy.url, label:taxonomy.name})
            })
            setTaxonomies(listTaxonomies)             
        })    
        
        { (parent != undefined) ?
            getTaxonomy(parent)
            .then((response) => {
                setCurrentParent(response.data.name)                
            })          
            : setCurrentParent("Sin padre")    
        }          
    }, []);  
    
    useEffect(() => {                 
        if (taxonomies !== []) {
            taxonomies.forEach(item => {
                if(item.value === parent){
                    setSelectTaxonomy({label:item.label, value:item.value })
                }
            });
        }
        if ( typeOption !== []) {
            typeOption.forEach(item => {
                if(item.value === type){
                    setSelectedType({label:item.label, value:item.value })
                }
            });
        }
        
    }, [taxonomies]); 
    

    const editTaxonomy = ()=> {        
        putTaxonomy(taxonomy.url, type, name, description, active, parent)
        .then(() => {                        
            window.location.href = '/taxonomies';
        })
        .catch((error) => {
            console.log(error)           
            setShowAlert(true) 
        })
    };

    const resetShowAlert = () => {
        setShowAlert(false);
    }     
    
    let typeOption = [
        {
            value : 'vulnerability',
            label : 'Vulnerabilidad'
        },
        {
            value : 'incident',
            label : "Incidente"
        }

    ]

    return (
        <React.Fragment>
            <Alert showAlert={showAlert} resetShowAlert={resetShowAlert} component="taxonomy"/>
            <Row>
                <Navigation actualPosition="Editar taxonomia" path="/taxonomies" index ="Taxonomia"/> 
            </Row>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Taxonomia</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col sm={12} lg={4}>
                                        <Form.Group>
                                            <Form.Label>Nombre <b style={{color:"red"}}>*</b></Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                defaultValue={taxonomy.name} 
                                                onChange={(e) => setName(e.target.value)} 
                                                isInvalid={!validateName(name)}
                                            />
                                            {validateName(name) ? '' : <div className="invalid-feedback">Ingrese un nombre que contenga hasta 100 caracteres, solo letras y que no sea vacio</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} lg={1}>
                                        <Form.Group>
                                            <Form.Label>Estado</Form.Label>
                                            <DropdownState state={taxonomy.active} setActive={setActive}></DropdownState>
                                        </Form.Group>
                                    </Col>                                    
                                    <Col sm={12} lg={3}>
                                        <SelectLabel set={setType} setSelect={setSelectedType} options={typeOption}
                                                value={selectedType} placeholder="Tipo" required={true}/> 
                                    </Col>
                                    <Col sm={12} lg={4}>
                                        <SelectLabel set={setParent} setSelect={setSelectTaxonomy} options={taxonomies}
                                                value={selectTaxonomy} placeholder="Padre" required={true}/>  
                                    </Col>                                    
                                </Row>
                                <Row>                                
                                    <Col sm={12} lg={12}>
                                        <Form.Group>
                                            <Form.Label>Descripcion</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3} 
                                                defaultValue={taxonomy.description} 
                                                onChange={(e) => setDescription(e.target.value)}  
                                                isInvalid={(validateUnrequiredInput(description)) ? !validateDescription(description) : false} 
                                            />
                                            {validateDescription(description) ? '' : <div className="invalid-feedback">Ingrese una descripcion que contenga hasta 250 caracteres y que no sea vacía</div>}
                                        </Form.Group>
                                    </Col>
                                </Row>                               
                                <Form.Group as={Col}>
                                    { validateType(type) && validateName(name) && name !== "" ?
                                        <Button variant="primary" onClick={editTaxonomy}>Guardar</Button>                                    
                                        : 
                                        <Button variant="primary" disabled>Guardar</Button>                                    
                                    }
                                    <Button variant="info" href='/taxonomies'>Cancelar</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>                    
            </Row>           
        </React.Fragment>
    );
};

export default EditTaxonomy;
