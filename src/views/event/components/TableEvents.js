import React,{ useState, useEffect} from 'react'
import { Table , Modal, Row,Col, Form,  Spinner } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import CrudButton from '../../../components/Button/CrudButton';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import CallBackendByName from '../../../components/CallBackendByName'; 
import { getTLPSpecific } from '../../../api/services/tlp';
import { deleteEvent} from "../../../api/services/events";
import Ordering from '../../../components/Ordering/Ordering'


const TableEvents = ({events, loading, selectedEvent, setSelectedEvent, order, setOrder, setLoading, currentPage, taxonomyNames, feedNames}) => {

    const [deleteName, setDeleteName] = useState()
    const [deleteUrl, setDeleteUrl] = useState()
    const [remove, setRemove] = useState()
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    //checkbox
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => { 
        setList(events)
        
       
      }, [events]);
   
    if (loading) {
        return (
            <Row className='justify-content-md-center'>
                <Spinner animation='border' variant='primary' size='sm' />
            </Row>
        );    
    }

    
    const callbackTlp = (url ,setPriority) => {
        getTLPSpecific(url)
        .then((response) => {
          
            setPriority(response.data)
        })
        .catch();
    }
    
    const modalDelete = (name, url)=>{
        setDeleteName(name)
        setDeleteUrl(url) 
        setRemove(true)
    }

    const handleDelete = () => {
        deleteEvent(deleteUrl).then(() => {
            window.location.href = '/events';
          })
          .catch((error) => {
            setError(error);
          })
    }
        ////////////////////////////////////////////////////
     
    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setSelectedEvent(events.filter(item => item.solve_date == null).map(li => li.url));
        if (isCheckAll) {
            setSelectedEvent([]);
        }
      };
    
      const handleClick = e => { 
        const { id, checked } = e.target;
        setSelectedEvent([...selectedEvent, id]);
        if (!checked) {
          setSelectedEvent(selectedEvent.filter(item => item !== id));
        }
      };
    
      ////////////////////////////////////////////////////

      const letterSize= { fontSize: '1.1em' }
  return (
    <div>
        
            <ul className="list-group my-4">
                <Table responsive hover className="text-center">
                    <thead>
                        <tr>
                            <th>
                                <Form.Group>
                                    <Form.Check type="checkbox" id={"selectAll"}  
                                        onChange={handleSelectAll} checked={selectedEvent.length != 0 ? isCheckAll : false} /> {/*|| selectedCases == list.filter(item => item.solve_date == null).length */}
                                </Form.Group>
                            </th>
                        
                            <Ordering field="date" label="Fecha" order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize}/>
                            <th style={letterSize}>Identificador </th>
                            <th style={letterSize}>Dominio</th>
                            <th style={letterSize}>Cidr</th>
                            <th style={letterSize}>TLP</th>
                            <th style={letterSize}>Taxonomia</th>
                            <th style={letterSize}>Fuente de Informacion</th>
                            <th style={letterSize}>Opciones</th>
                        </tr>
                   </thead>
                    <tbody>
                    {list.map((event, index) => {
                        return (
                            <tr key={index}>
                                <th ><Form.Group>
                                            <Form.Check disabled={event.solve_date != null ? true : false} 
                                                type="checkbox" id={event.url} 
                                                onChange={handleClick} checked={selectedEvent.includes(event.url)} />
                                        </Form.Group>
                                </th>

                                <td>{event.date ? event.date.slice(0,10)+" "+event.date.slice(11,19): ""}</td>
                                <td>{event.address_value}</td>
                                <td>{event.domain}</td>
                                <td>{event.cidr}</td>
                                
                                <td><CallBackendByName url={event.tlp} callback={callbackTlp } useBadge={true}/></td>
                                
                                <td>{taxonomyNames[event.taxonomy]}</td>
                                
                                <td>{feedNames[event.feed]}</td>
                                
                                <td>
                                <Link to={{pathname:"/events/view", state: event}} >
                                    <CrudButton  type='read'   />
                                </Link>
                                
                                <Link to={{pathname:"/events/edit", state: event}} >
                                    <CrudButton  type='edit' />
                                </Link>
                                    <CrudButton  type='delete' onClick={()=>modalDelete(event.name, event.url)} />
                                </td>
                                
                              </tr>
                              )
                        })}
        <ModalConfirm type='delete' component='Estado' name={deleteName} showModal={remove} onHide={() => setRemove(false)} ifConfirm={() => handleDelete(deleteUrl)}/> 

                    </tbody>
                </Table>
                      </ul>
                      <ModalConfirm type='delete' component='Estado' name={deleteName} showModal={remove} onHide={() => setRemove(false)} ifConfirm={() => handleDelete(deleteUrl)}/>    

        <Modal size='lg' show={modalShow} onHide={() => setModalShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>            
            <Modal.Body>
                <Row>    
                    <Col>                 
                        
                    </Col> 
                </Row>
            </Modal.Body>            
        </Modal>

    </div>
  )
}

export default TableEvents