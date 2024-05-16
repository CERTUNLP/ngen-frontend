import React, { useEffect, useState } from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import { getMinifiedPriority } from '../../../api/services/priorities';
import { getMinifiedTlp } from '../../../api/services/tlp';
import { getMinifiedUser } from '../../../api/services/users';
import ViewFiles from '../../../components/Button/ViewFiles';
import FileUpload  from '../../../components/UploadFiles/FileUpload/FileUpload'
import FileList from '../../../components/UploadFiles/FileList/FileList'
import Alert from '../../../components/Alert/Alert';
import { putCase, postCase } from '../../../api/services/cases';
import { useLocation } from "react-router-dom";
import SelectLabel from '../../../components/Select/SelectLabel';
import { useTranslation, Trans } from 'react-i18next';

const FormCase = (props) => {  // props: edit, caseitem, allStates 

    const location = useLocation();
    const fromState = location.state;
    const [url, setUrl] = useState(props.edit ? props.caseItem.url : null) 
    const [date, setDate] = useState(props.caseItem.date  !== null ? props.caseItem.date.substr(0,16) : '') 
    const [lifecycle, setLifecycle] = useState(props.caseItem.lifecycle) 
    const [parent, setParent] = useState(props.caseItem.parent) 
    const [priority, setPriority] = useState(props.caseItem.priority) 
    const [name, setName] = useState(props.caseItem.name) 
    const [tlp, setTlp] = useState(props.caseItem.tlp) 
    const [assigned, setAssigned] = useState(props.caseItem.assigned)
    const [state, setState] = useState(props.caseItem.state) 
    const [comments, setComments] = useState([]) 
    const [evidences, setEvidences] = useState(props.caseItem.evidence)
    const [attend_date, setAttend_date] = useState(props.caseItem.attend_date !== null ? props.caseItem.attend_date.substr(0,16) : '') 
    const [solve_date, setSolve_date] = useState(props.caseItem.solve_date!== null ? props.caseItem.solve_date.substr(0,16) : '')

    //select
    const [allPriorities, setAllPriorities ] = useState([])
    const [allTlp, setAllTlp] = useState([])
    const [allUsers, setAllUsers] = useState([])

    //Alert
    const [showAlert, setShowAlert] = useState(false);

    //desactivar button al hacer post
    const [ifClick, setIfClick] = useState(false);

    //commet
    const [ comm, setComm ] = useState();

    const [selectPriority, setSelectPriority] = useState("")
    const [selectTlp, setSelectTlp] = useState("")
    const [selectLifecycle, setSelectLifecycle] = useState("") 
    const [selectState, setSelectState] = useState("") 
    const [selectAssigned, setSelectAssigned] = useState("") 
    const { t } = useTranslation();

    useEffect(()=> {
        
        if (allPriorities !== []) {
            allPriorities.forEach(item => {
                if(item.value === priority){
                    setSelectPriority({label:item.label, value:item.value })
                }
            });
        }
        if (allTlp !== []) {
            allTlp.forEach(item => {
                if(item.value === tlp){
                    setSelectTlp({label:item.label, value:item.value })
                }
            });
        }
        if (allUsers !== []) {
            allUsers.forEach(item => {
                if(item.value === assigned){
                    setSelectAssigned({label:item.label, value:item.value })
                }
            });
        }
        if (props.allStates !== []) {
            props.allStates.forEach(item => {
                if(item.value === state){
                    setSelectState({label:item.label, value:item.value })
                }
            });
        }
        if (allLifecycles !== []) {
            allLifecycles.forEach(item => {
                if(item.value === lifecycle){
                    setSelectLifecycle({label:item.label, value:item.value })
                }
            });
        }

    },[allPriorities, allTlp, allUsers, props.allStates])
    useEffect(()=> {
      
        getMinifiedPriority()
        .then((response) => {
            let listPriority = []
            response.map((priority) => {
              listPriority.push({value:priority.url, label:priority.name})
            })

            setAllPriorities(listPriority)
        })
        .catch((error)=>{
            console.log(error)
        })

        getMinifiedTlp()
        .then((response) => {
            let listTlp = []
            response.map((tlp) => {
              listTlp.push({value:tlp.url, label:tlp.name})
            })
            setAllTlp(listTlp)
        })
        .catch((error)=>{
            console.log(error)
        })

        getMinifiedUser()
        .then((response) => {
            let listUser = []
            response.map((user) => {
                listUser.push({value:user.url, label:user.username})
            })

            setAllUsers(listUser)
        })
        .catch((error)=>{
            console.log(error)
        })


    },[props.allStates])
     

    const allLifecycles = [
        {
            value: "manual",
            label: "Manual"
        },
        {
            value: "auto",
            label: "Auto"
        },
        {
            value: "auto_open",
            label: "Auto open"
        },
        {
            value: "auto_close",
            label: "Auto close"
        }
    ]
    
    /***************************************/
    const handleDragOver = (event) => {
        event.preventDefault();
        console.log('1-------------------------')
      }
    const handleDrop = (event) => {
        console.log('2-------------------------')
        event.preventDefault();
        const filesToUpload = event.dataTransfer.files
        setEvidences([...evidences, ...filesToUpload]);
        console.log('3-------------------------')
    };
    const removeFile = (position) => {
        if (evidences.length>0){
            setEvidences(evidences.filter((file, index) => index !== position));
        }
      }
/********************************************** */

    //Edit
    const editCase = () => {
        console.log(comments)
        console.log(evidences)
        setIfClick(true);
        const form = new FormData();
        form.append("date", date)
        form.append("lifecycle",lifecycle)
        if(parent !== null) {
            form.append("parent", parent)
        }
        form.append("priority", priority)
        form.append("tlp", tlp)
        if(assigned !== null) {
            form.append("assigned", assigned)
        }
        form.append("state", state)
        form.append("attend_date", attend_date)
        form.append("solve_date", solve_date)
        //form.append("evidence", evidences)
        if (evidences !== null){
            for (let index=0; index< evidences.length  ; index++){
                form.append("evidence", evidences[index])
                console.log(evidences[index])
            }
        }/*else{
            form.append("evidence", evidences)
        }
        */
        if (comm !== null){
            let array = comments;
            array.push(comm)
            setComments((e) => [...e, comm])
            console.log(comm);
            console.log(array);
            console.log(comments);
            form.append("comments", comm)   
        }
        console.log(form)

        putCase(url, form)
        .then((response) => { 
            console.log(response)
            window.location.href = "/cases"
            
        })
        .catch((error) => {
            setShowAlert(true)
            setIfClick(false)
        });    
    };
    console.log(fromState)

    //Create
    const addCase = () => {
        setIfClick(true);
        const form = new FormData();
        form.append("date", date)
        form.append("lifecycle",lifecycle)
        if(parent !== null) {
            form.append("parent", parent)
        }
        form.append("priority", priority)
        form.append("name", name)
        form.append("tlp", tlp)
        if(assigned !== null) {
            form.append("assigned", assigned)
        }
        form.append("state", state)
        form.append("attend_date", attend_date)
        form.append("solve_date", solve_date)
        if (props.selectedEvent !== undefined){
            
            props.selectedEvent.forEach(selectedEvent => {
                form.append("events", selectedEvent);
            });
        }
        //form.append("evidence", evidences)
        if (evidences !== null){
            for (let index=0; index< evidences.length  ; index++){
            form.append("evidence", evidences[index])
            console.log(evidences[index])
            }
        }/*else{
            form.append("evidence", evidences)
        }
        */
        if (comm !== null){
            let array = comments;
            array.push(comm)
            setComments((e) => [...e, comm])
            console.log(comm);
            console.log(array);
            console.log(comments);
            form.append("comments", array)   
        }

        console.log(form)

        postCase(form)
        .then((response) => { 
            console.log(response)
            if (fromState === "redirecToCreateEvent"){
                window.location.href = "/events/create"
            }else{
                window.location.href = "/cases"           
            }
            if (props.selectedEvent !== undefined){
                props.setSelectedEvent([])
                props.setSelectCase("")
                props.setShowModalCase(false)
            } 
            
            

        })
        .catch((error) => {
            console.log(error.data)
            setShowAlert(true)
            setIfClick(false)
        });    
    };

    return (
        <React.Fragment>  
            <Alert showAlert={showAlert} resetShowAlert={() => setShowAlert(false)} component="case"/>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">{t('Fechas')}</Card.Title>
                </Card.Header>
                <Card.Body> 
                    <Row>
                        <Col lg={4} sm={12}>
                            <Form.Group controlId="Form.Case.Date">
                                <Form.Label>{t('Fecha de ocurrencia')} <b style={{color:"red"}}>*</b></Form.Label>
                                <Form.Control type="datetime-local" //2023-03-24T01:40:14.181622Z 
                                    value={date} //yyyy-mm-ddThh:mm
                                    min="2000-01-01T00:00" max="2030-01-01T00:00" 
                                    onChange={(e) => setDate(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col lg={4} sm={12}>
                            <Form.Group controlId="Form.Case.Attend_date">
                                <Form.Label>{t('Fecha de atencion')}</Form.Label>
                                <Form.Control type="datetime-local"
                                    value={attend_date} //yyyy-mm-ddThh:mm
                                    min="2000-01-01T00:00" max="2030-01-01T00:00" 
                                    onChange={(e) => setAttend_date(e.target.value)}/>
                            </Form.Group> 
                        </Col>
                        <Col sm={12} lg={4}>
                            <Form.Group controlId="Form.Case.Solve_date">
                                <Form.Label>{t('Fecha de resolucion')}</Form.Label>
                                <Form.Control type="datetime-local"
                                    value={solve_date} //yyyy-mm-ddThh:mm
                                    min="2000-01-01T00:00" max="2030-01-01T00:00" 
                                    onChange={(e) => setSolve_date(e.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>


            <Card>
                <Card.Header>
                    <Card.Title as="h5">{t('Principal')}</Card.Title>
                </Card.Header>
                <Card.Body> 
                    <Row>
                    <Col lg={6} sm={12}>
                            <Form.Group controlId="Form.Case.Comments">
                                <Form.Label>{t('Nombre del caso')} </Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="name" 
                                    placeholder={t('Nombre del caso')} 
                                    maxlength="100"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3} sm={12}>                        
                                 <SelectLabel set={setPriority} setSelect={setSelectPriority} options={allPriorities}
                                    value={selectPriority} placeholder={t('Prioridad')} required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                                <SelectLabel set={setLifecycle} setSelect={setSelectLifecycle} options={allLifecycles}
                                    value={selectLifecycle} placeholder={t('Ciclo de vida')} required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                                <SelectLabel set={setTlp} setSelect={setSelectTlp} options={allTlp}
                                    value={selectTlp} placeholder={t('TLP')} required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                            <SelectLabel set={setState} setSelect={setSelectState} options={props.allStates}
                                    value={selectState} placeholder={t('Estado')} required={true}/>
                        </Col>

                        <Col lg={3} sm={12}>
                            <SelectLabel set={setAssigned} setSelect={setSelectAssigned} options={allUsers}
                                    value={selectAssigned} placeholder={t('Asignado')}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col >
                            <Form.Group controlId="Form.Case.Comments">
                                <Form.Label>{t('Comentarios')}</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    name="comment" 
                                    placeholder="Comentarios" 
                                    maxlength="500"
                                    value={comm} 
                                    onChange={(e) => setComm(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {props.edit ?
            <Card>
                <Card.Header>    
                    <Card.Title as="h5">{t('Evidencias')}</Card.Title>              
                </Card.Header>
                <Card.Body>
                    <Row>
                        {evidences.map((url, index) => {
                            console.log(url)
                            return  (
                                <Col>
                                    <ViewFiles url={url} index={index+1} /> {/*setIfDelete={setIfDelete} */}
                                </Col> )
                        })}
                    </Row>
                </Card.Body>
                <Card.Body>
                    <Form>   
                        <Form.Group controlId="Form.Case.Evidences.Drag&Drop">
                            <div
                                className="dropzone"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}>
                                <FileUpload files={evidences} setFiles={setEvidences} removeFile={removeFile} />
                                <FileList files={evidences} removeFile={removeFile} />
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

            : 
            <Card>
                <Card.Header>    
                    <Card.Title as="h5">{t('Evidencias')}</Card.Title>              
                </Card.Header>
                <Card.Body>
                    <Form>   
                        <Form.Group controlId="Form.Case.Evidences.Drag&Drop">
                            <div
                                className="dropzone"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}>
                                <FileUpload files={evidences} setFiles={setEvidences} removeFile={removeFile} />
                                <FileList files={evidences} removeFile={removeFile} />
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

            }
                 
            {/*!date || !lifecycle || !priority || !tlp || !state || ifClick ? */}
            {  date !== "" &&  priority !== '' && lifecycle !== '' && tlp !=='' && state !== ''? 
                <><Button variant="primary" onClick={props.edit ? editCase : addCase}>{props.save}</Button></>:
                <><Button variant="primary" disabled>{props.save}</Button></> 
                
            }
            <Button variant="primary" href="/cases">{t('Cancelar')}</Button>
        </React.Fragment>
    );
};
            
export default FormCase;
