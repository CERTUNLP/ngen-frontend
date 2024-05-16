import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Row, Form, Table, Spinner } from 'react-bootstrap';
import CrudButton from '../../../components/Button/CrudButton';
import { deleteCase } from '../../../api/services/cases';
import { Link } from 'react-router-dom';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import Ordering from '../../../components/Ordering/Ordering'
import LetterFormat from '../../../components/LetterFormat';
import { useTranslation, Trans } from 'react-i18next';



const TableCase = ({setIfModify, cases, loading, setLoading, selectedCases, setSelectedCases, setOrder , order,  priorityNames, stateNames, tlpNames, userNames}) => {
    
    const [url, setUrl] = useState(null) 
    const [modalDelete, setModalDelete] = useState(false)
    const [id, setId] = useState(null) 
        
    //checkbox
    const [isCheckAll, setIsCheckAll] = useState(false);

    const [list, setList] = useState([]);

    const { t } = useTranslation();
  
    //ORDER
    useEffect(() => { 
        setList(cases)
        
       
      }, [cases]);
    const storageCaseUrl = (url) => {
        localStorage.setItem('case', url);    
    }

    if (loading) {
        return (
            <Row className='justify-content-md-center'>
                <Spinner animation='border' variant='primary' size='sm' />
            </Row>
        );    
    }

    //Remove Case
    const Delete = (url, id) => {
        setId(id)
        setUrl(url)
        setModalDelete(true)
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


    return (
            <React.Fragment>
                <Table responsive hover className="text-center">
                    <thead>
                        <tr>
                            {list.length > 0 ?
                            <th>
                                <Form.Group>
                                    <Form.Check type="checkbox" id={"selectAll"} //lo que superpone es un parametro llamado custom
                                        onChange={handleSelectAll} checked={selectedCases.length !== 0 ? isCheckAll : false} /> 
                                </Form.Group>
                            </th>
                            :
                            <th>
                                <Form.Group>
                                    <Form.Check custom type="checkbox" disabled />
                                </Form.Group>
                            </th>
                            }
                            <Ordering field="created" label={t('Fecha de creación')} order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize}/>
                            <Ordering field="priority" label={t('Prioridad')} order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize}/>
                            <th style={letterSize}> {t('TLP')} </th>
                            <th style={letterSize}> {t('Estado')} </th>
                            <th style={letterSize}> {t('Asignado')} </th>
                            <th style={letterSize}> {t('Accion')} </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    {
                        list.map((caseItem, index) => {
                            let datetime = caseItem.date.split('T');
                            datetime = datetime[0] + ' ' + datetime[1].slice(0,8)
                            let idItem = caseItem.url.split('/')[(caseItem.url.split('/')).length-2]
                             
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
                                    <td>
                                        {datetime}
                                    </td>
                                    <td>
                                        {priorityNames[caseItem.priority]}
                                    </td>
                                
                                    <td>
                                        <LetterFormat useBadge={true} stringToDisplay={tlpNames[caseItem.tlp].name} color={tlpNames[caseItem.tlp].color}/>
                                    </td>
                                    
                                    <td>
                                        {stateNames[caseItem.state] ? stateNames[caseItem.state] : "No se pudo asignar un estado"}
                                    </td>
                                    {userNames[caseItem.user_creator] ? 
                                        <td>
                                            {userNames[caseItem.user_creator]}
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
                                          
                                            {caseItem.solve_date == null ? 
                                              <Link to={{pathname:'/cases/edit', state: caseItem.url}} >
                                                <CrudButton type='edit'/>
                                                </Link>
                                                :   
                                                <Button 
                                                    id="button_hover"
                                                    className='btn-icon btn-rounded' 
                                                    variant='outline-warning'
                                                    title='Caso resuelto'
                                                    disabled
                                                    style={{
                                                        border: "1px solid #555", 
                                                        borderRadius: "50px",
                                                        color: "#555", 
                                                      }}
                                                     >
                                                <i className='fa fa-edit' style={{color: "#555"}}  ></i>
                                                </Button>}

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
