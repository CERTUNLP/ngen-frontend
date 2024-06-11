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
import SmallEventTable from '../../event/components/SmallEventTable';
import ModalListEvent from '../../event/ModalListEvent';
import { getMinifiedFeed } from '../../../api/services/feeds';
import { getMinifiedTaxonomy } from '../../../api/services/taxonomies';
import ModalReadEvent from '../../event/ModalReadEvent';
import { getEvent } from '../../../api/services/events';

const FormCase = (props) => {  // props: edit, caseitem, allStates 

    const location = useLocation();
    const fromState = location.state;
    const [url, setUrl] = useState(props.edit ? props.caseItem.url : null) 
    const [date, setDate] = useState(props.caseItem.date  !== null ? props.caseItem.date.substr(0,16) : getCurrentDateTime()) 
    const [lifecycle, setLifecycle] = useState(props.caseItem.lifecycle) 
    const [parent, setParent] = useState(props.caseItem.parent) 
    const [priority, setPriority] = useState(props.caseItem.priority) 
    const [name, setName] = useState(props.caseItem.name) 
    const [tlp, setTlp] = useState(props.caseItem.tlp) 
    const [assigned, setAssigned] = useState(props.caseItem.assigned)
    const [state, setState] = useState(props.caseItem.state) 
    const [events, setEvents] = useState(props.caseItem.events !== [] ? props.caseItem.events : []) 
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

    const [taxonomyNames, setTaxonomyNames] = useState({});
    const [tlpNames, setTlpNames] = useState({});
    const [feedNames, setFeedNames] = useState({});
    const [priorityNames, setPriorityNames] = useState({});
    const [userNames, setUserNames] = useState({});

    const [showModalListEvent, setShowModalListEvent] = useState(false);
    const [updatePagination, setUpdatePagination] = useState(false)
   
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState([]);
    const [eventList, setEventList] = useState([]) 
    const [taxonomyFilter, setTaxonomyFilter] = useState("");
    const [tlpFilter, setTlpFilter] = useState("");
    const [feedFilter, setFeedFilter] = useState("");
    const [taxonomies, setTaxonomies] = useState([]);  
    const [feeds, setFeeds] = useState([])
    const [wordToSearch, setWordToSearch] = useState("");
    const [modalShowEvent, setModalShowEvent] = useState(false);
    const [selectedEventDetail, setSelectedEventDetail] = useState({});
    const [updateList, setUpdateList] = useState(false)
    const [selectFeedFilter, setSelectFeedFilter] = useState("");
    const [selectTlpFilter, setSelectTlpFilter] = useState("")
    const [selectTaxonomyFilter, setSelectTaxonomyFilter] = useState("");
    const [tableDetail, setTableDetail] = useState(false);

    useEffect(()=> {
        /*setSelectedEventDetail({url:url, date:date, address_value:address_value, domain:domain, cidr:cidr, tlp:tlp, 
            taxonomy:taxonomy, feed:feed})*/
        if(Object.keys(taxonomyNames).length !== 0 && Object.keys(feedNames).length !== 0 && Object.keys(tlpNames).length !== 0 
        && events !== []){
            async function fetchAndSetEvents(events) {
                try {
                    const responses = await Promise.all(events.map(event => getEvent(event).then((response) => {return response.data})))
                    console.log(responses)
                    const newEventList = responses.map(response => ({
                        url: response.url,
                        date: response.date,
                        address_value: response.address_value,
                        domain: response.domain,
                        cidr: response.cidr,
                        tlp: response.tlp,
                        taxonomy: response.taxonomy,
                        feed: response.feed
                    }));
            
                    setEventList(newEventList);
                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
            
            // Llamada a la función
            fetchAndSetEvents(events);
        }

    },[taxonomyNames, feedNames, tlpNames, events])

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
        getMinifiedTaxonomy().then((response) => { 
            let dicTaxonomy = {}
            let listTaxonomies = [];
            response.map((taxonomy) => {
                dicTaxonomy[taxonomy.url] = taxonomy.name
                listTaxonomies.push({ value: taxonomy.url, label: taxonomy.name });
            })
            setTaxonomyNames(dicTaxonomy)
            setTaxonomies(listTaxonomies);
          })
          .catch((error) => {
            console.log(error)
              
          })
  
          getMinifiedFeed().then((response) => { //se hardcodea las paginas
            let dicFeed={}
            let listFeeds = [];
            response.map((feed) => {
                dicFeed[feed.url]= feed.name
                listFeeds.push({ value: feed.url, label: feed.name });
            })
            setFeedNames(dicFeed)
            setFeeds(listFeeds);
          })
          .catch((error) => {
            console.log(error)
              
          })
      
        getMinifiedPriority()
        .then((response) => {
            let listPriority = []
            let dicPriority={}
            response.map((priority) => {
              listPriority.push({value:priority.url, label:priority.name})
              dicPriority[priority.url]= priority.name
            })
            setPriorityNames(dicPriority)
            setAllPriorities(listPriority)
        })
        .catch((error)=>{
            console.log(error)
        })

        getMinifiedTlp()
        .then((response) => {
            let listTlp = []
            let dicTlp = {}
            response.map((tlp) => {
              listTlp.push({value:tlp.url, label:tlp.name})
              dicTlp[tlp.url]={name:tlp.name, color:tlp.color}
            })
            setAllTlp(listTlp)
            setTlpNames(dicTlp)
        })
        .catch((error)=>{
            console.log(error)
        })

        getMinifiedUser()
        .then((response) => {
            let listUser = []
            let dicUser={}
            response.map((user) => {
                listUser.push({value:user.url, label:user.username})
                dicUser[user.url]= user.username
            })
            setAllUsers(listUser)
            setUserNames(dicUser)
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
      }
    const handleDrop = (event) => {
        event.preventDefault();
        const filesToUpload = event.dataTransfer.files
        setEvidences([...evidences, ...filesToUpload]);
    };
    const removeFile = (position) => {
        if (evidences.length>0){
            setEvidences(evidences.filter((file, index) => index !== position));
        }
    }
/********************************************** */

    //Edit
    const editCase = () => {
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
            }
        }/*else{
            form.append("evidence", evidences)
        }
        */
        if (comm !== null){
            let array = comments;
            array.push(comm)
            setComments((e) => [...e, comm])
            form.append("comments", comm)   
        }

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
        if (events !== []){
            
            events.forEach(selectedEvent => {
                form.append("events", selectedEvent);
            });
        }
        //form.append("evidence", evidences)
        if (evidences !== null){
            for (let index=0; index< evidences.length  ; index++){
            form.append("evidence", evidences[index])
            }
        }
        if (comm !== null){
            let array = comments;
            array.push(comm)
            setComments((e) => [...e, comm])
            form.append("comments", array)   
        }

        postCase(form)
        .then((response) => { 
            if (props.createCaseModal){
               
                if (props.setCaseToLink !== undefined){    
                    props.setCaseToLink({name:response.data.name, date:response.data.date, 
                        priority:priorityNames[response.data.priority], tlp:tlpNames[response.data.tlp].name, 
                        state:props.stateNames[response.data.state], user:userNames[response.data.user_creator]})
                        
                    props.completeField1("case", {value:response.data.url ,name:response.data.name, date:response.data.date, 
                        priority:priorityNames[response.data.priority], tlp:tlpNames[response.data.tlp].name, 
                        state:props.stateNames[response.data.state], user:userNames[response.data.user_creator]}, props.setSelectCase)
                   
                }
                if (props.selectedEvent !== undefined){
                    
                    props.setSelectedEvent([])
                    props.setSelectCase("")
                    props.setRefresh(!props.refresh)
                } 
                props.setShowModalCase(false)
                //props.setUpdateCases(response)
            }else{
                window.location.href = "/cases"           
            }
           
        })
        .catch((error) => {
            console.log(error)
            setShowAlert(true)
            setIfClick(false)
        });    
    };
    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = '00';
        const minutes = '00';
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const modalListEvent = () => {
        setUpdatePagination(true)
        setShowModalListEvent(true);
    }

    function closeModal(){
        setShowModalListEvent(false)
        setCurrentPage(1);
    }

    function linkEventsToCase(){
        setEvents(selectedEvent.map(event => event.url))
        setEventList(selectedEvent)
        setShowModalListEvent(false)
        setCurrentPage(1);

    }

    const returnToListOfEvent=()=>{ 
        setShowModalListEvent(true)
        setModalShowEvent(false)
        setUpdatePagination(true)
    };

    const linkCaseToEvent=()=>{
        setSelectedEvent([...selectedEvent, selectedEventDetail]);
        setShowModalListEvent(true)
        setModalShowEvent(false)
        setUpdatePagination(true)
        setUpdateList(!updateList)
        /*setShowModalListCase(false)
        setModalShowCase(false)
        setCurrentPage(1);
        setTlpFilter("")
        setWordToSearch("")
        setUpdatePagination(true)*/
    };

    const modalEventDetail = (url, date , address_value, domain, cidr, tlp, taxonomy, feed) => {
        console.log(url)    
        localStorage.setItem('event', url);
        setModalShowEvent(true)
        setShowModalListEvent(false)
        localStorage.setItem('navigation', false);  
        localStorage.setItem('button return', false);     
        setSelectedEventDetail({url:url, date:date, address_value:address_value, domain:domain, cidr:cidr, tlp:tlp, 
            taxonomy:taxonomy, feed:feed});
    }
    
    const tableCaseDetail = (url, date , address_value, domain, cidr, tlp, taxonomy, feed) => {
        localStorage.setItem('event', url);
        setModalShowEvent(true)
        setTableDetail(true)
        localStorage.setItem('navigation', false);  
        localStorage.setItem('button return', false);     
        setSelectedEventDetail({url:url, date:date, address_value:address_value, domain:domain, cidr:cidr, tlp:tlp, 
            taxonomy:taxonomy, feed:feed});
    }

    const closeModalDetail=()=>{ 
        setModalShowEvent(false)
        setTableDetail(false)
    };
    
    const deleteEventFromForm=(url)=>{ 
        setEventList(eventList.filter(event => event.url !== url))
        setSelectedEvent(selectedEvent.filter(event => event.url !== url))
    };

    return (
        <React.Fragment>  
            <Alert showAlert={showAlert} resetShowAlert={() => setShowAlert(false)} component="case"/>
            <Card>
                <Card.Header>
                    <Card.Title as="h5">Principal</Card.Title>
                </Card.Header>
                <Card.Body> 
                    <Row>
                    <Col lg={6} sm={12}>
                            <Form.Group controlId="Form.Case.Comments">
                                <Form.Label>Nombre del caso </Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="name" 
                                    placeholder="Nombre del caso" 
                                    maxlength="100"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg={3} sm={12}>
                            <Form.Group controlId="Form.Case.Date">
                                <Form.Label>Fecha de inicio de gestión </Form.Label>
                                <Form.Control type="datetime-local" //2023-03-24T01:40:14.181622Z 
                                    
                                    value={date} //yyyy-mm-ddThh:mm
                                    min="2000-01-01T00:00" max="2030-01-01T00:00" 
                                    onChange={(e) => setDate(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col lg={3} sm={12}>                        
                                 <SelectLabel set={setPriority} setSelect={setSelectPriority} options={allPriorities}
                                    value={selectPriority} placeholder="Prioridad" required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                                <SelectLabel set={setLifecycle} setSelect={setSelectLifecycle} options={allLifecycles}
                                    value={selectLifecycle} placeholder="Ciclo de vida" required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                                <SelectLabel set={setTlp} setSelect={setSelectTlp} options={allTlp}
                                    value={selectTlp} placeholder="TLP" required={true}/>
                        </Col>
                        <Col lg={3} sm={12}>
                            <SelectLabel set={setState} setSelect={setSelectState} options={props.allStates}
                                    value={selectState} placeholder="Estado" required={true}/>
                        </Col>

                        <Col lg={3} sm={12}>
                            <SelectLabel set={setAssigned} setSelect={setSelectAssigned} options={allUsers}
                                    value={selectAssigned} placeholder="Asignado"/>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col >
                            <Form.Group controlId="Form.Case.Comments">
                                <Form.Label>Comentarios</Form.Label>
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
            <SmallEventTable list={eventList} modalEventDetail={tableCaseDetail} 
                modalListEvent={modalListEvent} deleteEventFromForm={deleteEventFromForm}/>

            <ModalListEvent showModalListEvent={showModalListEvent} modalEventDetail={modalEventDetail} 
                selectFeedFilter={selectFeedFilter} setSelectFeedFilter={setSelectFeedFilter}
                selectTlpFilter={selectTlpFilter} setSelectTlpFilter={setSelectTlpFilter}
                selectTaxonomyFilter={selectTaxonomyFilter} setSelectTaxonomyFilter={setSelectTaxonomyFilter}
                currentPage={currentPage}  setCurrentPage={setCurrentPage}
                setUpdatePagination={setUpdatePagination} updatePagination={updatePagination} 
                selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} 
                taxonomyNames={taxonomyNames} feedNames={feedNames} tlpNames={tlpNames}
                closeModal={closeModal} linkEventsToCase={linkEventsToCase}
                wordToSearch={wordToSearch} setWordToSearch={setWordToSearch}
                taxonomyFilter={taxonomyFilter} setTaxonomyFilter={setTaxonomyFilter}
                tlpFilter={tlpFilter} setTlpFilter={setTlpFilter} feedFilter={feedFilter} setFeedFilter={setFeedFilter}
                taxonomies={taxonomies} feeds={feeds}  tlpList={allTlp} updateList={updateList}/>

            <ModalReadEvent modalShowCase={modalShowEvent} tableDetail={tableDetail} returnToListOfCases={returnToListOfEvent} 
                linkCaseToEvent={linkCaseToEvent} closeModalDetail={closeModalDetail}/>

            {props.evidenceColum ?
            
            props.edit ?
            <Card>
                <Card.Header>    
                    <Card.Title as="h5">Evidencias</Card.Title>              
                </Card.Header>
                <Card.Body>
                    <Row>
                        {evidences.map((url, index) => {
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
                    <Card.Title as="h5">Evidencias</Card.Title>              
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
            : 
            ""

            }
            
            {
                 priority !== '' && lifecycle !== '' && tlp !=='' && state !== ''? 
                <><Button variant="primary" onClick={props.edit ? editCase : addCase}>{props.save}</Button></>:
                <><Button variant="primary" disabled>{props.save}</Button></> 
            }
            {props.buttonsModalColum ?
            <Button variant="primary" href="/cases">Cancelar</Button>
            :
            <Button variant="primary" onClick={()=>props.setShowModalCase(false)}>Cancelar</Button>
            }
            
        </React.Fragment>
    );
};
            
export default FormCase;
