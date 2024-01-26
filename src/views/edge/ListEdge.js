import React, {useState,useEffect} from 'react'
import { Button, Card, CloseButton, Col, Collapse, Modal, Row, Table} from 'react-bootstrap';
import CrudButton from '../../components/Button/CrudButton';
import AdvancedPagination from '../../components/Pagination/AdvancedPagination';
import FormCreateEdge from './components/FormCreateEdge';
import { getAllStates, getState } from "../../api/services/states";
import { postEdge, getAllEdges } from "../../api/services/edges";
import RowEdge from './components/RowEdge';


const ListEdge = ({state, sectionAddEdge, setShowAlert}) => {
    
    const [states, setStates]=useState([])
    const [edges, setEdges]=useState([])
    const [listChildren, setListChildren]=useState([])
    const [children, setChildren]=useState([])
    const [urlByStateName, setUrlByStateName]=useState({})
    const [error,setError]=useState()
    const [edge, setEdge] = useState({
        discr: "",
        parent:"",
        child: null
    })
    const [selectChild, setSelectChild] = useState("");

    //Create Edge
    const [modalCreate, setModalCreate] = useState(false)
    

    const [edgeCreated, setEdgeCreated] = useState(null);
    const [edgeDeleted, setEdgeDeleted] = useState(null);
    const [edgeUpdated, setEdgeUpdated] = useState(null);

    //AdvancedPagination
    const [currentPage, setCurrentPage] = useState(1);
    const [countItems, setCountItems] = useState(0);


     useEffect( ()=> {
        if(state.url !== undefined ){
            getState(state.url).then((response) => { 
                //este metodo es para las posibles opciones a hora de cargar un edge en el formulario
                setListChildren(findElementsWithSameUrl(response.data.children, states))
                
              })
              .catch((error) => {
                  console.log(error)
              })
        }
        if(state.url !== undefined ){
            getAllEdges().then((response) => { 
                //necito listar todos los edges que esten asociado a este estado padre

                setEdges(findElementsTheEdges(state.url, response))
              })
              .catch((error) => {
                  setError(error)
                  
              })
        }
        

        getAllStates().then((response) => { 
            var listChildren = []
            var listStates = []
            var dicState={}
            response.map((state)=>{
                listChildren.push({value:state.url, label:state.name})
                listStates.push(state)
                dicState[state.url]=state.name
            })
            setChildren(listChildren)
            setStates(listStates)
            setUrlByStateName(dicState)
          })
          .catch((error) => {
              setError(error)
              
          })
        
    },[edgeCreated, edgeDeleted, edgeUpdated])

    /**/

    function updatePage(chosenPage){
        setCurrentPage(chosenPage);
    }

    function findElementsWithSameUrl(url, states) {

        if (url !== undefined){
            const foundItems = [];
        
            states.forEach(elemento => {
                if (url.includes(elemento.url)) {
                    foundItems.push(elemento);
                }
             
            });
        
            return foundItems
        }
    }
    function findElementsTheEdges(url, edges) {

        if (url !== undefined){
            const foundItems = [];
        
            edges.forEach(edges => {
                if (url === edges.parent) {
                    foundItems.push(edges);
                }
             
            });
        
            return foundItems
        }
    }

    const createEdge = () => { 

        postEdge(edge.discr, state.url, edge.child)
            .then((response) => { 
                setEdgeCreated(response)
                setEdge({
                    discr: "",
                    parent: null,
                    child: null
                })
                setSelectChild("")
                setModalCreate(false)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() =>{
            setShowAlert(true)
        })
    };

    
  return (
    <div>
        <Row>
            <Col>
                <Card>
                    <Card.Header>
                        <Row>
                            <Col sm={12} lg={9}>
                                <Card.Title as="h5">Transiciones</Card.Title>
                                <span className="d-block m-t-5">Lista de transiciones</span>
                            </Col>
                            <Col sm={12} lg={3}>
                                {sectionAddEdge ? 
                                <CrudButton type='create' name='transición' onClick={() => setModalCreate(true)} />
                                :
                                <><Button variant="outline-primary" disabled>Agregar transición</Button></> 
                                }
                            </Col>
                        </Row>
                    </Card.Header>

                    <Collapse in={sectionAddEdge}>
                        <div id="basic-collapse">
                        <Card.Body >
                                <Table responsive hover className="text-center">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            			
                                            <th>Nombre de la transicion </th>
                                            <th>Estado posterior </th>
                                            <th>Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {edges ? edges.map((edge, index) => {
                                            return (
                                                <RowEdge url={edge.url}  edges={edges} urlByStateName={urlByStateName} states={states} listChildren={children} id={index+1} edgeDeleted={edgeDeleted} setEdgeDeleted={setEdgeDeleted} edgeUpdated={edgeUpdated} setEdgeUpdated={setEdgeUpdated} setShowAlert={setShowAlert}/>)
                                            }) : <></>
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                            <Card.Footer >
                                <Row className="justify-content-md-center">
                                    <Col md="auto"> 
                                        <AdvancedPagination countItems={countItems} updatePage={updatePage} ></AdvancedPagination>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </div>
                    </Collapse>
                </Card>
            </Col>
        </Row>

        <Modal size='lg' show={modalCreate} onHide={() => setModalCreate(false)} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <Row>    
                    <Col>                 
                        <Card>
                        <Card.Header> 
                                <Row>
                                    <Col>
                                        <Card.Title as="h5">Transición</Card.Title>
                                        <span className="d-block m-t-5">Crear transición</span>
                                    </Col>
                                    <Col sm={12} lg={2}>                       
                                        <CloseButton aria-label='Cerrar' onClick={() => setModalCreate(false)} />
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                            <FormCreateEdge 
                                body={edge}
                                setBody={setEdge}
                                selectChild={selectChild} setSelectChild={setSelectChild}
                                childernes={children} 
                                ifConfirm={createEdge} ifCancel={() => setModalCreate(false)} />
                            </Card.Body>
                        </Card>
                    </Col> 
                </Row>
            </Modal.Body>
        </Modal>
        
    </div>
  )
}

export default ListEdge