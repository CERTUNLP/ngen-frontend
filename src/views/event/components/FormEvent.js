import React,{useState, useEffect} from 'react'
import { Row, Card, Form, Button,Col, Modal, CloseButton } from 'react-bootstrap'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CrudButton from '../../../components/Button/CrudButton';
import SelectComponent from '../../../components/Select/SelectComponent';
import FormArtifact from '../../artifact/components/FormArtifact'
import FileUpload  from '../../../components/UploadFiles/FileUpload/FileUpload'
import FileList from '../../../components/UploadFiles/FileList/FileList'
import TableCase from "../../case/components/TableCase";
import { postArtifact } from "../../../api/services/artifact";
import { postStringIdentifier } from "../../../api/services/stringIdentifier";
import { postCase } from "../../../api/services/cases";
import Alert from '../../../components/Alert/Alert';
import ModalFormCase from './ModalFormCase';
import {getMinifiedState } from '../../../api/services/states';
import Search from '../../../components/Search/Search';
import FilterSelectUrl from '../../../components/Filter/FilterSelectUrl';
import ReadCase from '../../case/ReadCase';
const animatedComponents = makeAnimated();
//{createEvent, setBody, body, feeds, taxonomy, tlp, priorities, users, listArtifact, setContactsCreated}
const FormEvent = (props) => {
    const [artifactsValueLabel, setArtifactsValueLabel] = useState([])
    const [modalCreate, setModalCreate] = useState(false)
    const [typeArtifact, setTypeArtifact] = useState('0')
    const [value, setValue] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)

    //modal create case
    const [showModalCase, setShowModalCase] = useState(false);
    const [showModalListCase, setShowModalListCase] = useState(false);

    //create case
    const [bodyCase, setBodyCase] = useState({
        date:"",
        lifecycle:"",
        parent:"",
        priority:"",
        tlp:"",
        name: "",
        assigned:"",
        state:"",
        attend_date:"",
        solve_date:"",
        selectedEvent:"",
        comments:[],
          
      }) 
    const [evidenceCase, setEvidenceCase] = useState([])
    //commet
    const [ comm, setComm ] = useState();
    const [selectPriority, setSelectPriority] = useState()
    const [selectTlp, setSelectTlp] = useState()
    const [selectTaxonomy, setSelectTaxonomy] = useState()
    const [selectFeed, setSelectFeed] = useState()
    const [selectReporter, setSelectReporter] = useState()
    const [selectCase, setSelectCase] = useState("")
    const [allStates, setAllStates] = useState([]) //multiselect

    const [errorMessage, setErrorMessage] = useState('');

    const [modalShowCase, setModalShowCase] = useState(false);

    const modalCaseDetail = (url) => {
        localStorage.setItem('case', url);
        setModalShowCase(true)
    } 
    const resetShowAlert = () => {
        setShowAlert(false);
    } 

    useEffect(()=> {
        getMinifiedState()
        .then((response) => {
            let listStates = []
            response.map((stateItem)=>{
                listStates.push({value:stateItem.url, label:stateItem.name, childrenUrl:stateItem.children})
            })
        })
        .catch((error)=>{
            console.log(error)
        })
        
        if (props.cases !== []) {
            props.cases.forEach(item => {
                if(item.value === props.body.case){
                    setSelectCase({label:item.label, value:item.value })
                }
            });
        }
        if (props.tlp !== []) {
            props.tlp.forEach(item => {
                if(item.value === props.body.tlp){
                    setSelectTlp({label:item.label, value:item.value })
                }
            });
        }
        if (props.taxonomy !== []) {
            props.taxonomy.forEach(item => {
                if(item.value === props.body.taxonomy){
                    setSelectTaxonomy({label:item.label, value:item.value })
                }
            });
        }
        if (props.feeds !== []) {
            props.feeds.forEach(item => {
                if(item.value === props.body.feed){
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
        if (props.users !== []) {
            props.users.forEach(item => {
                if(item.value === props.body.reporter){
                    setSelectReporter({label:item.label, value:item.value })
                }
            });
        }

        let listDefaultArtifact = props.listArtifact.filter(elemento => props.body.artifacts.includes(elemento.value))
        .map(elemento => ({value: elemento.value, label:elemento.label}))

        setArtifactsValueLabel(listDefaultArtifact)
    
    },[props.body.artifacts, props.listArtifact, props.cases])

    const completeFieldStringIdentifier=(event)=>{ 
       
        if (event.target.value !==""){ 
            postStringIdentifier(event.target.value).then((response) => { 
                console.log(response.data.artifact_type)
                console.log(event.target.value)
                setShowErrorMessage(response.data.artifact_type === "OTHER" || response.data.artifact_type === "EMAIL")        
            })
            .catch((error) => {
                console.log(error)
            }).finally(() => {
                
            })   
        }

        if (event.target.value === "" ){
            setShowErrorMessage(false)//para que no aparesca en rojo si esta esta el input vacio en el formulario
        }   
        props.setBody({...props.body,[event.target.name] : event.target.value})
    }

    const completeField=(event)=>{ 
        props.setBody({...props.body,
            [event.target.name] : event.target.value}
        )       
    };

    const selectArtefact=(event)=>{ 
        props.setBody({...props.body,
            ["artifacts"] : event.map((e)=>{
                return e.value
            })}
        )
        console.log(props.body.artifacts)
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const filesToUpload = event.dataTransfer.files
        props.setEvidence([...props.evidence, ...filesToUpload]);
    };

    const removeFile = (position) => {
        if (props.evidence.length>0){
            props.setEvidence(props.evidence.filter((file, index) => index !== position));
        }
    };
    
    const createArtifact = () => {
        console.log(value)
        //postArtifact(typeArtifact, Math.floor(value)) por que use un Math.floor(value) no me acuerdo
        postArtifact(typeArtifact, value)
        .then((response) => { 
            props.setContactsCreated(response) //
            setModalCreate(false) //
            setTypeArtifact("-1")
            setValue("")
        })
        .catch((error) => {
            console.log(error)
        }).finally(() => {
            setModalCreate(false)
        })  
    };
    const modalCase = () => {
        //setId
        setShowModalCase(true);
    }
    const modalListCase = () => {
        //setId
        setShowModalListCase(true);
    }
    //Create
  const createCase = () => {
    const form = new FormData();
    form.append("date",bodyCase.date)
    form.append("name",bodyCase.name)
    form.append("lifecycle",bodyCase.lifecycle)
    if(bodyCase.parent !== null) {
        form.append("parent", bodyCase.parent)
    }
    form.append("priority", bodyCase.priority)
    form.append("tlp", bodyCase.tlp)
    if(bodyCase.assigned !== null) {
        form.append("assigned", bodyCase.assigned)
    }
    form.append("state", bodyCase.state)
    form.append("attend_date", bodyCase.attend_date)
    form.append("solve_date", bodyCase.solve_date)
        
    if (evidenceCase !== null){
        for (let index=0; index< evidenceCase.length  ; index++){
        form.append("evidence", evidenceCase[index])
        console.log(evidenceCase[index])
        }
    }/*else{
        form.append("evidence", evidences)
    }
    */
    if (comm !== null){
        let array = bodyCase.comments;
        array.push(comm)
        setBodyCase((prevBodyCase) => ({
          ...prevBodyCase,
          comments: comm,
        }));
        //setComments((e) => [...e, comm])
        console.log(comm);
        console.log(array);
        console.log(bodyCase.comments);
        form.append("comments", array)   
    }

    console.log(form)
    postCase(form)
        .then((response) => { 
          setBodyCase({
            date:"",
            lifecycle:"",
            parent:"",
            priority:"",
            tlp:"",
            assigned:"",
            state:"",
            attend_date:"",
            solve_date:"",
            selectedEvent:"",
            comments:[],
              
          })
          setShowModalCase(false)
          props.setUpdateCases(response)
            
        })
        .catch((error) => {
            console.log(error.data)
            setShowAlert(true)
        }); 
    };

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
    //console.log(new Date(props.body.date) < new Date()) valido
    //console.log(new Date())
    //console.log(props.body.date)
    //console.log(props.body.date < getCurrentDateTime()) valido
    
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = '00';
        const minutes = '00';
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    const modalStyles = {
        width: "100%",
    };

  return (
    <div>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Principal</Card.Title>
            </Card.Header>
            <Alert showAlert={showAlert} resetShowAlert={resetShowAlert}/>
            <Card.Body>
            <Form>
                <Row>
                    <Col sm={12} lg={4}>
                        <Form.Group controlId="formGridAddress1">
                        <Form.Label>Fecha <b style={{color:"red"}}>*</b></Form.Label>
                        <Form.Control 
                            type ="datetime-local"
                            maxLength="150"
                            max={getCurrentDateTime()} 
                            value ={props.body.date}
                            isInvalid={new Date(props.body.date) > new Date()} 
                            onChange={(e)=>completeField(e)}
                            name="date"/>
                            {new Date(props.body.date) > new Date() ? <div className="invalid-feedback"> Se debe ingresar una fecha menor a la de hoy</div> : ""  }
                        </Form.Group>
                        
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="TLP" options={props.tlp} value={selectTlp} nameField="tlp"
                                        onChange={completeField1} placeholder="Seleccione un tlp" setOption={setSelectTlp} required={true} 
                                        />
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="Taxonomia" options={props.taxonomy} value={selectTaxonomy} nameField="taxonomy" 
                                        onChange={completeField1} placeholder="Seleccione una taxonomia" setOption={setSelectTaxonomy} required={true}
                                        disabled={(props.body.children !== [] && props.body.children.length > 0 )? true: false}/>
                    </Col>
                </Row>       
                <Row>
                    <Col sm={12} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="Fuente de Informacion" options={props.feeds} value={selectFeed} nameField="feed"
                                            onChange={completeField1} placeholder="Seleccione una Fuente de Informacion" setOption={setSelectFeed} required={true}
                                            disabled={(props.body.children !== [] && props.body.children.length > 0 )? true: false}/>
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="Prioridades" options={props.priorities} value={selectPriority} nameField="priority"
                                                onChange={completeField1} placeholder="Seleccione una Prioridad" setOption={setSelectPriority} required={true}/>
                    </Col>
                    <Col sm={12} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="Usuario que reporta" options={props.users} value={selectReporter} nameField="reporter"
                                            onChange={completeField1} placeholder="Usuario que reporta" setOption={setSelectReporter} required={false}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} lg={4}>
                        <SelectComponent controlId="exampleForm.ControlSelect1" label="Caso asociado" options={props.cases} value={selectCase} nameField="case"
                                            onChange={completeField1} placeholder="Seleccione un caso" setOption={setSelectCase} required={false}/>
                    </Col>
                    <Col sm={4} lg={4}>
                    <br></br>
                    <Button 
                            size="lm"
                            variant="outline-dark"
                            onClick={() => modalCase()}
                            >
                            Crear nuevo caso
                    </Button>
                    </Col>
                    <Col sm={4} lg={4}>
                    <br></br>
                    {/*<Button 
                            size="lm"
                            variant="outline-dark"
                            onClick={() => modalListCase()}
                            >
                            Vincular a caso 
                    </Button>*/}
                    </Col>
                </Row>
                <Form.Group controlId="formGridAddress1">
                <Form.Label>Notas</Form.Label>
                <Form.Control 
                    placeholder="Ingrese " 
                    maxLength="150" 
                    value ={props.body.notes}
                    onChange={(e)=>completeField(e)}
                    name="notes"/>
                </Form.Group>
                </Form>
            </Card.Body>
        </Card>
        <Card>
            <Card.Header>
                <Card.Title as="h5">Artefactos</Card.Title>
            </Card.Header>
            <Card.Body>
            <Form>
                <Form.Group controlId="formGridAddress1">
                <Form.Label>Artefactos</Form.Label>
                    <Row>
                        <Col sm={12} lg={9}>
                                <Select
                                    placeholder='Seleccione artefactos'
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    value={artifactsValueLabel}
                                    onChange={selectArtefact}
                                    options={props.listArtifact}/>
                        </Col>
                        <Col sm={12} lg={3}>
                            <CrudButton type='create' name='Artefacto' onClick={() => setModalCreate(true)}/>
                        </Col>
                    </Row>
                </Form.Group>
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
                        maxLength="150" 
                        value ={props.body.address_value} 
                        disabled={(props.body.children !== [] && props.body.children.length > 0 )? true: false}
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
                <Card.Title as="h5">Evidencias</Card.Title>
            </Card.Header>
        <Card.Body>
            <Form>   
                <Form.Group controlId="formGridAddress1">
                    <div
                        className="dropzone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}>
                        <FileUpload files={props.evidence} setFiles={props.setEvidence} removeFile={removeFile} />
                        <FileList files={props.evidence} removeFile={removeFile} />
                    </div>
                </Form.Group>    
            </Form>
            <Modal size='lg' show={modalCreate} onHide={() => setModalCreate(false)} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <Row>    
                        <Col>                 
                            <Card>
                            <Card.Header> 
                                    <Row>
                                        <Col>
                                            <Card.Title as="h5">Artefacto</Card.Title>
                                            <span className="d-block m-t-5">Crear Artefacto</span>
                                        </Col>
                                        <Col sm={12} lg={2}>                       
                                            <CloseButton aria-label='Cerrar' onClick={() => setModalCreate(false)} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                <FormArtifact 
                                     value={value} setValue={setValue}
                                     type={typeArtifact} setType={setTypeArtifact}
                                    ifConfirm={createArtifact} ifCancel={() => setModalCreate(false)} />
                                </Card.Body>
                            </Card>
                        </Col> 
                    </Row>
                </Modal.Body>
            </Modal> 
            <Modal show={showModalCase} onHide={() => setShowModalCase(false)} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar eventos a un caso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                  <div id="example-collapse-text">
                   <ModalFormCase body={bodyCase} setBody={setBodyCase} 
                                evidence={evidenceCase}  setEvidence={setEvidenceCase} 
                                createCase={createCase} comm={comm} setComm={setComm} />
                  </div>
                <Modal.Footer>
                        <Button variant="outline-primary" onClick={createCase  }>
                        Crear
                        </Button>

                        <Button variant="outline-secondary" onClick={() => setShowModalCase(false)}>Cancelar</Button>
                </Modal.Footer>
                </Modal.Body>
                
            </Modal>
            <Modal show={showModalListCase} onHide={() => setShowModalListCase(false)} aria-labelledby="contained-modal-title-vcenter" centered style={modalStyles}>
                <Modal.Header closeButton>
                    <Col sm={1} lg={6}>
                        <Search type="caso" setWordToSearch={props.setWordToSearch} wordToSearch={props.wordToSearch} setLoading={props.setLoading}/> 
                    </Col>
                    <Col sm={4} lg={4}>
                        <FilterSelectUrl options={props.priorities} itemName="prioridad" partOfTheUrl="priority" itemFilter={props.priorityFilter}  itemFilterSetter={props.setPriorityFilter} setLoading={props.setLoading} setCurrentPage={props.setCurrentPage}/>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <div id="example-collapse-text">
                        <TableCase cases={props.cases} loading={props.loading} selectedCases={props.selectedCases} 
                            setSelectedCases={props.setSelectedCases} order={props.order}  setOrder={props.setOrder} 
                            setIfModify={props.setIfModify} setLoading={props.setLoading} priorityNames={props.priorityNames}
                            stateNames={props.stateNames} tlpNames={props.tlpNames} userNames={props.userNames}
                            editColum={false} deleteColum={false} detailModal={true} modalCaseDetail={modalCaseDetail}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={createCase  }>
                        Vincular
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setShowModalListCase(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modalShowCase} onHide={() => setModalShowCase(false)} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div id="example-collapse-text">
                        <ReadCase />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={createCase  }>
                        Vincular
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setModalShowCase(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
   
            </Card.Body>
        </Card>
        
        { !(new Date(props.body.date) > new Date()) &&  props.body.tlp !== "" && props.body.taxonomy !== "" && props.body.feed !== ""
            && props.body.priority !== "" && props.body.address_value !== "" && !showErrorMessage?
            <Button variant="primary" onClick={props.createEvent} >Guardar</Button> 
            : 
            <Button variant="primary" disabled>Guardar</Button>                                    
        }
        <Button variant="primary" href="/events">Cancelar</Button>      
    </div>
  )
}
export default FormEvent