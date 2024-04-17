import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import { Card,Row,Col, Button, Badge, Collapse, Form, Modal } from 'react-bootstrap';
import Navigation from '../../components/Navigation/Navigation'
import Search from '../../components/Search/Search'
import CrudButton from '../../components/Button/CrudButton';
import TableEvents from './components/TableEvents';
//filters
import FilterSelectUrl from '../../components/Filter/FilterSelectUrl';
import FilterSelect from '../../components/Filter/FilterSelect';

import AdvancedPagination from '../../components/Pagination/AdvancedPagination';
import ModalConfirm from '../../components/Modal/ModalConfirm';
import Alert from '../../components/Alert/Alert';
import ButtonFilter from '../../components/Button/ButtonFilter';
import Select from 'react-select';
import { getMinifiedCase, patchCase, postCase } from "../../api/services/cases";
import ModalFormCase from './components/ModalFormCase';

//filters
import { getEvents, mergeEvent} from "../../api/services/events";
import { getMinifiedFeed } from "../../api/services/feeds";
import { getMinifiedTaxonomy } from '../../api/services/taxonomies';
import { getMinifiedTlp } from "../../api/services/tlp";


const ListEvent = () => {
  const [events, setEvents] = useState([])
  
  const [loading, setLoading] = useState(true)

  const [refresh,setRefresh]= useState(true)

  //url by name
  // tlp feed
  const [taxonomyNames, setTaxonomyNames] = useState({});
  const [feedNames, setFeedNames] = useState({});
  const [tlpNames, setTlpNames] = useState({});

  //pagination
  const [countItems, setCountItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1)

  const [ifModify, setIfModify] = useState(null) 
  const [showAlert, setShowAlert] = useState(false)
  //event merge Event
  //merge
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [showModal, setShowModal] = useState(false);

  //filters and search
  const [wordToSearch, setWordToSearch]= useState('')
  const [taxonomyFilter, setTaxonomyFilter]= useState('')
  
  const [tlpFilter, setTlpFilter]= useState('')
  const [feedFilter, setFeedFilter]= useState('')

  const [tlpList, setTlpList] = useState([])
  const [taxonomies, setTaxonomies] = useState([]);  
  const [feeds, setFeeds] = useState([])

  const [order, setOrder] = useState("-date");
  const [starDateFilter, setStarDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")
  const [starDate, setStarDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filterDate, setFilterDate] = useState(false)
  const [open, setOpen] = useState(false);
  const [updatePagination, setUpdatePagination] = useState(false)
  const [disabledPagination, setDisabledPagination] = useState(true)
  const types = [{ value: "true", label: "Eventos sin casos asignados" },{ value: "false", label: "Eventos con casos asignados" }]
  const [caseIsNull, setCaseIsNull]= useState('')
  //add to cases
  const [openCases, setOpenCases] = useState(true);

  //modal case
  const [showModalCase, setShowModalCase] = useState(false);
  const [cases, setCases] = useState([])
  const [selectCase, setSelectCase] = useState("")

  //create case
  const [bodyCase, setBodyCase] = useState({
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
    comments:[]
      
  }) 
  const [evidenceCase, setEvidenceCase] = useState([])

  //commet
  const [ comm, setComm ] = useState();

  useEffect(() => {
    getMinifiedCase()
        .then((response) => { 
            setCases(response.map(item => ({ value: item.url, label: item.name + " " + item.uuid })));
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        });
      getMinifiedTaxonomy()
          .then((response) => {
              let listTaxonomies = [];
              let dicTaxonomy = {};
              response.map((taxonomy) => {
                  listTaxonomies.push({ value: taxonomy.url, label: taxonomy.name });
                  dicTaxonomy[taxonomy.url] = taxonomy.name;
              });
              setTaxonomyNames(dicTaxonomy);
              setTaxonomies(listTaxonomies);
          });

      getMinifiedFeed()
          .then((response) => {
              let listFeeds = [];
              let dicFeed = {};
              response.map((feed) => {
                  listFeeds.push({ value: feed.url, label: feed.name });
                  dicFeed[feed.url] = feed.name;
              });
              setFeedNames(dicFeed);
              setFeeds(listFeeds);
          });

      getMinifiedTlp()
          .then((response) => {
              let listTlp = [];
              let dicTlp = {};
              response.map((tlp) => {
                  listTlp.push({ value: tlp.url, label: tlp.name });
                  dicTlp[tlp.url] = { name: tlp.name, color: tlp.color };
              });
              setTlpList(listTlp);
              setTlpNames(dicTlp);
          });
  }, []);

  useEffect(() => {
      getEvents(currentPage, starDateFilter + endDateFilter + taxonomyFilter + tlpFilter + feedFilter + caseIsNull + wordToSearch, order)
          .then((response) => {
              setEvents(response.data.results);
              setCountItems(response.data.count);
              if (currentPage === 1) {
                  setUpdatePagination(true);  
              } 
              setFilterDate(false);
              setDisabledPagination(false);
          })
          .catch((error) => {
              setShowAlert(true); // ¿Hace falta?
              console.log(error);
          })
          .finally(() => {
              setLoading(false);
              setShowAlert(true);
          });
  }, [currentPage, ifModify, wordToSearch, taxonomyFilter, tlpFilter, feedFilter, filterDate, order, caseIsNull, refresh]);


  function updatePage(chosenPage){
    setCurrentPage(chosenPage);
  }

  const reloadPage = () => {
    setRefresh(!refresh)
  }

  const mergeConfirm = () => {
    //setId
    setShowModal(true);
  }

  const merge = () => {
    const parent = selectedEvent.shift();
    selectedEvent.forEach(child => {
        console.log(`MERGE --> parent: ${parent} \n          child:${child} `)
        mergeEvent(parent, child)
            .then(response => setIfModify(response))
            .catch(error => console.log(error))
            .finally(() => {
                setSelectedEvent([])
                setShowModal(false)
            })
    });
  }

  const modalCase = () => {
    //setId
    setShowModalCase(true);
  }


  const completeDateStar = (date) => {
    setStarDate(date)
    setStarDateFilter("created_range_after="+date+'&')
    if ((endDateFilter !== "")&&(starDateFilter !== "created_range_after="+date+'&')){ // este if esta porque si no hay cambios en el WordToSearch 
      //haciendo que no se vuelva a ejecutar el useEffect y qeu al setearce setloading en true quede en un bucle infinito
      setFilterDate(true)
      setLoading(true)
    }
  }

  const completeDateEnd = (date) => {
    setEndDate(date)
    setEndDateFilter("created_range_before="+date+'&')
    if ((endDateFilter !== "created_range_before="+date+'&')&&(starDateFilter !=="")){ // este if esta porque si no hay cambios en el WordToSearch 
      //haciendo que no se vuelva a ejecutar el useEffect y qeu al setearce setloading en true quede en un bucle infinito
      setFilterDate(true)
      setLoading(true)
    }
  }

  const complete=(selectCase)=>{ 
    setSelectCase(selectCase)
    console.log(selectCase)

  };


  const addEventsToCase=()=>{ 
    patchCase(selectCase.value,selectedEvent ).then((response) => {
      setSelectedEvent([])
      setSelectCase("")
      setIfModify(response)

    })
    setShowModalCase(false);
  };
  const clearModal=()=>{ 
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
    setSelectedEvent([])
    setSelectCase("")
    setShowModalCase(false)

  };

  //Create
  const createCase = () => {
    const form = new FormData();
    form.append("date",bodyCase.date)
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
        
    selectedEvent.forEach(selectedEvent => {
        form.append("events", selectedEvent);
    });
    
    //form.append("evidence", "http://localhost:8000/api/event/1/")
    //form.append("evidence", ["http://localhost:8000/api/event/1/", "http://localhost:8000/api/event/2/"])
    //form.append("evidence", evidences)
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
          setSelectedEvent([])
          setSelectCase("")
          setShowModalCase(false)
            
        })
        .catch((error) => {
            console.log(error.data)
            setShowAlert(true)
        }); 
};


  return (
     <div>
       <Alert showAlert={showAlert} resetShowAlert={() => setShowAlert(false)} component="event"/>
       <Row>
          <Navigation actualPosition="Eventos"/>
      </Row>
      <Card>
        <Card.Header>
        <Row>
        <Col sm={1} lg={1}>
          <ButtonFilter open={open} setOpen={setOpen} />
        </Col>
        <Col sm={8} lg={4} >
              <Search type="por taxonomia, fuentes o recurso afectado" setWordToSearch={setWordToSearch} wordToSearch={wordToSearch} setLoading={setLoading} />
        </Col>
        <Col> 
            <Link to={"/events/create"} >
                <CrudButton type='create' name='Evento' /> 
            </Link>
            <Button 
                disabled={selectedEvent.length > 1 ? false : true}
                size="lm"
                className='text-capitalize'
                variant="outline-dark"
                title='Mergear'
                onClick={() => mergeConfirm()}>
                <i  className="fa fa-code-branch"/>
                    Merge&nbsp;
                <Badge  
                    className="badge mr-1" >
                    {selectedEvent.length} 
                </Badge>
            </Button>
            <Button 
                disabled={selectedEvent.length > 0 ? false : true}
                size="lm"
                variant="outline-dark"
                onClick={() => modalCase()}>
                Agregar a un caso
                <Badge  
                    className="badge mr-1" >
                    {selectedEvent.length} 
                </Badge>
            </Button>                                 
            <Button 
              size="lm"
              variant="outline-dark"
              onClick={() => reloadPage()}
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
              </svg>
          </Button>

            
            
        </Col>
      </Row>
      <Collapse in={open}>
        <div id="example-collapse-text">
        <Row>
            <Col sm={12} lg={6}>
              <Form.Group controlId="formGridAddress1">
                <Form.Label>Fecha desde</Form.Label>
                <Form.Control 
                  type="date"
                  maxLength="150" 
                  placeholder="Fecha desde"
                  value={starDate} 
                  onChange={(e) => completeDateStar(e.target.value)}
                  name="date"
                />
              </Form.Group>
            </Col>
            <Col sm={12} lg={6}>
              <Form.Group controlId="formGridAddress1">
                <Form.Label>Fecha hasta</Form.Label>
                <Form.Control 
                  type="date"
                  maxLength="150" 
                  value={endDate} 
                  onChange={(e) => completeDateEnd(e.target.value)}
                  name="date"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4} lg={4}>
              <FilterSelectUrl options={tlpList} itemName="tlp" partOfTheUrl="tlp" itemFilter={tlpFilter} itemFilterSetter={setTlpFilter} setLoading={setLoading} setCurrentPage={setCurrentPage}/>
            </Col>
            <Col sm={4} lg={4}>
              <FilterSelectUrl options={taxonomies} itemName="taxonomia" partOfTheUrl="taxonomy" itemFilter={taxonomyFilter}  itemFilterSetter={setTaxonomyFilter} setLoading={setLoading} setCurrentPage={setCurrentPage}/>
            </Col>
            <Col sm={4} lg={4}>
              <FilterSelectUrl options={feeds} itemName="fuentes" partOfTheUrl="feed" itemFilter={feedFilter} itemFilterSetter={setFeedFilter} setLoading={setLoading} setCurrentPage={setCurrentPage}/>
            </Col>
            
          </Row>
          <Row>
              <Col sm={4} lg={4}>
                  <FilterSelect options={types} partOfTheUrl="case__isnull" setFilter={setCaseIsNull} currentFilter={caseIsNull} setLoading={setLoading} placeholder="Filtrar por casos" />
              </Col>
            
          </Row>
          <br /> 
        </div>
      </Collapse>              
        </Card.Header>
        <Card.Body>
           <TableEvents events={events} loading={loading} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} order={order} setOrder={setOrder} 
           setLoading={setLoading} currentPage={currentPage} taxonomyNames={taxonomyNames} feedNames={feedNames} tlpNames={tlpNames}/> 
        </Card.Body>
        <Card.Footer >
          <Row className="justify-content-md-center">
              <Col md="auto"> 
                  <AdvancedPagination countItems={countItems} updatePage={updatePage} updatePagination={updatePagination} setUpdatePagination={setUpdatePagination} setLoading={setLoading} setDisabledPagination={setDisabledPagination} disabledPagination={disabledPagination}/>
              </Col>
          </Row>
      </Card.Footer>
      <ModalConfirm type='merge' component='eventos' name={selectedEvent} showModal={showModal} onHide={() => setShowModal(false)} ifConfirm={() => merge()}/>
      <Modal show={showModalCase} onHide={() => clearModal()} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar eventos a un caso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Button variant="primary" className='text-capitalize' size="sm" active={openCases} onClick={() => setOpenCases(!openCases)} aria-expanded={openCases}>
                  Agregar a un caso existente
                </Button>
                <Button variant="primary" className='text-capitalize' size="sm" active={!openCases} onClick={() => setOpenCases(!openCases)} aria-expanded={!openCases}>
                  Crear a un nuevo caso
                </Button>
                
                <Collapse in={openCases}>
                  <div id="example-collapse-text"> 
                  <Row>
                    <Col sm={10} lg={10}>
                        
                        <Form.Group>
                            <Form.Label>Casos</Form.Label>
                            <Select options={cases} value={selectCase} isClearable placeholder={"Seleccione un caso"} onChange={(e) => complete(e)}  />
                        </Form.Group>
                    </Col>
                    </Row>
                    
                  </div>
                </Collapse>
                <Collapse in={!openCases}>
                  <div id="example-collapse-text">
                   <ModalFormCase body={bodyCase} setBody={setBodyCase} 
                                evidence={evidenceCase}  setEvidence={setEvidenceCase} 
                                createCase={createCase} comm={comm} setComm={setComm} />
                  </div>
                </Collapse>
                    <Modal.Footer>
                          <Button variant="outline-primary" onClick={openCases ? addEventsToCase: createCase  }>
                            {openCases ?  "Confirmar": "Crear"} 
                          </Button>

                          <Button variant="outline-secondary" onClick={() => clearModal()}>Cancelar</Button>
                    </Modal.Footer>
                </Modal.Body>
                
            </Modal>
      </Card>            
    </div>
  )
}
export default ListEvent