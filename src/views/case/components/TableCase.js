import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Row, Form, Table, Spinner } from 'react-bootstrap';
import CrudButton from '../../../components/Button/CrudButton';
import { deleteCase } from '../../../api/services/cases';
import { getAllPriorities, getMinifiedPriority } from '../../../api/services/priorities';
import { getTLP, getMinifiedTlp } from '../../../api/services/tlp';
import { getAllStates, getMinifiedState } from '../../../api/services/states'; 
import { Link } from 'react-router-dom';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import BadgeItem from '../../../components/Button/BadgeItem';
import CallBackendByName from '../../../components/CallBackendByName'; 
import { getTLPSpecific } from '../../../api/services/tlp';
import { getUser } from '../../../api/services/users';
import GetUserName from './GetUserName';
import Ordering from '../../../components/Ordering/Ordering'

const TableCase = ({setIfModify, cases, loading, setLoading, selectedCases, setSelectedCases, setOrder , order, currentPage, priorityNames, stateNames}) => {
    
    const [url, setUrl] = useState(null) 
    const [modalDelete, setModalDelete] = useState(false)
    const [id, setId] = useState(null) 
        
    //checkbox
    const [isCheckAll, setIsCheckAll] = useState(false);

    const [list, setList] = useState([]);
  
    //ORDER
    useEffect(() => { 
        setList(cases)
        
       
      }, [cases]);
    const storageCaseUrl = (url) => {
        localStorage.setItem('case', url);    
    }

    //Remove Case
    const Delete = (url, id) => {
        setId(id)
        setUrl(url)
        setModalDelete(true)
    }
     
    const callbackTlp = (url ,setPriority) => {
        getTLPSpecific(url)
        .then((response) => {
          
            setPriority(response.data)
        })
        .catch();
    }
    
    
    const removeCase = (url)=> {
        deleteCase(url)
            .then((response) => {
                setIfModify(response)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setModalDelete(false)
            })
        };

    //Checkbox 
    const handleSelectAll = e => {
        setIsCheckAll(!isCheckAll);
        setSelectedCases(list.filter(item => item.solve_date == null).map(li => li.url));
        if (isCheckAll) {
            setSelectedCases([]);
        }
    };
    const handleClick = e => { 
        const { id, checked } = e.target;
        setSelectedCases([...selectedCases, id]);
        if (!checked) {
            setSelectedCases(selectedCases.filter(item => item !== id));
        }
    };
    const letterSize= { fontSize: '1.1em' }
    console.log(list)
    return (
            <React.Fragment>
                <Table responsive hover className="text-center">
                    <thead>
                        <tr>
                            {list.length > 0 ?
                            <th>
                                <Form.Group>
                                    <Form.Check type="checkbox" id={"selectAll"} //lo que superpone es un parametro llamado custom
                                        onChange={handleSelectAll} checked={selectedCases.length != 0 ? isCheckAll : false} /> 
                                </Form.Group>
                            </th>
                            :
                            <th>
                                <Form.Group>
                                    <Form.Check custom type="checkbox" disabled />
                                </Form.Group>
                            </th>
                            }
                            <Ordering field="date" label="Fecha" order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize}/>
                            <Ordering field="priority" label="Prioridad" order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize}/>
                            <th style={letterSize}>TLP</th>
                            <th style={letterSize}>Estado</th>
                            <th style={letterSize}>Asignado</th>
                            <th style={letterSize}>Accion</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    {loading ? 
                        <tr>
                            <td colSpan="7">
                                <Row className="justify-content-md-center">
                                    <Spinner animation="border" variant="primary" size="sm" />
                                </Row>
                            </td>
                        </tr>
                        :
                        list.map((caseItem, index) => {
                            let datetime = caseItem.date.split('T');
                            datetime = datetime[0] + ' ' + datetime[1].slice(0,8)
                            let idItem = caseItem.url.split('/')[(caseItem.url.split('/')).length-2]
                            console.log(priorityNames)
                            console.log(stateNames[caseItem.state])
                            console.log(stateNames)
                            console.log(caseItem.state)
                            console.log(caseItem)
                             
                            return (
                                list &&
                                <tr key={index}>
                                    <td>
                                        <Form.Group>
                                            <Form.Check disabled={caseItem.solve_date !== null ? true : false} 
                                                type="checkbox" id={caseItem.url} 
                                                onChange={handleClick} checked={selectedCases.includes(caseItem.url)} />
                                        </Form.Group>
                                    </td>
                                    <td>{datetime}</td>
                                    <td>
                                        {priorityNames[caseItem.priority]}
                                    </td>
                                    <td>
                                    <td><CallBackendByName url={caseItem.tlp} callback={callbackTlp } useBadge={true}/></td>
                                    </td>
                                    <td>{stateNames[caseItem.state] ? stateNames[caseItem.state] : "No se pudo asignar un estado"}</td>
                                    {caseItem.assigned ? 
                                        <td>
                                            <GetUserName form={false} get={getUser} url={caseItem.assigned} key={index} />
                                        </td>
                                        :
                                        <td>
                                            Sin asignar
                                        </td> 
                                    }
                                    <td>
                                        <Link to={{pathname:'/cases/view'}}>
                                            <CrudButton type='read' onClick={() => storageCaseUrl(caseItem.url)}/>
                                        </Link>
                                            <Link to={{pathname:'/cases/edit', state: caseItem.url}} >
                                            {caseItem.solve_date == null ? 
                                                <CrudButton type='edit'/>
                                                :   
                                                <Button 
                                                    id="button_hover"
                                                    className='btn-icon btn-rounded' 
                                                    variant='outline-light'
                                                    title='Caso resuelto'
                                                    style={{
                                                        border: "1px solid",
                                                        borderRadius: "50px",
                                                        color:"#F54901",
                                                      }} >
                                                <i className='fa fa-edit' style={{color: "#F54901"}} ></i>
                                                </Button>}
                                            </Link>
                                        <CrudButton type='delete' onClick={() => Delete(caseItem.url, idItem)} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            <ModalConfirm type='delete' component='Caso' name={`el caso ${id}`} showModal={modalDelete} onHide={() => setModalDelete(false)} ifConfirm={() => removeCase(url)}/>
        </React.Fragment> 
  );
};

export default TableCase;
