import React from 'react';
import { useState } from 'react';
import { Row, Table, Spinner } from 'react-bootstrap';
import CrudButton from '../../../components/Button/CrudButton';
import { Link } from 'react-router-dom';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import ButtonView from './ButtonView'
import ButtonState from './ButtonState';
import { deleteTaxonomy } from '../../../api/services/taxonomies';
import Ordering from '../../../components/Ordering/Ordering'


const TableTaxonomy = ({setIsModify, list, loading, order, setOrder, setLoading}) => {
    const [modalDelete, setModalDelete] = useState(false) 
    const [url, setUrl] = useState(null) 
    const [name, setName] = useState(null) 

    if (loading) {
        return (
            <Row className='justify-content-md-center'>
                <Spinner animation='border' variant='primary' size='sm' />
            </Row>
        );    
    }
    
    // Remove Taxonomy
    const Delete = (url, name) => {
        setUrl(url)
        setName(name)
        setModalDelete(true)
    }
    
    const removeTaxonomy = (url, name)=> {
        deleteTaxonomy(url, name)
            .then((response) => {
                setIsModify(response)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setModalDelete(false)
            })
        };
        const letterSize= { fontSize: '1.1em' }
    
    return (
            <React.Fragment>
                <Table responsive hover className="text-center">
                    <thead>
                        <tr>
                            <Ordering field="name" label="Nombre" order={order} setOrder={setOrder} setLoading={setLoading} letterSize={letterSize} />
                            <th style={letterSize}>Activo</th>     
                            <th style={letterSize}>Eventos</th>                                                                         
                            <th style={letterSize}>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((taxonomy,index) =>{ 
                        return(
                            <tr key={index}>
                                <td>{taxonomy.name}</td>
                                <td>
                                    <ButtonState taxonomy={taxonomy}></ButtonState>
                                </td>                                           
                                <td>{taxonomy.reports.length}</td>
                                <td>
                                    <ButtonView taxonomy={taxonomy}></ButtonView> 
                                    <Link to={{pathname:"./taxonomies/edit", state:taxonomy}} >
                                        <CrudButton type="edit" />                                                    
                                    </Link>                                               
                                    <CrudButton type='delete' onClick={() => Delete(taxonomy.url, taxonomy.name)} />
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </Table>
            
            <ModalConfirm type='delete' component='Taxonomia' name={name} showModal={modalDelete} onHide={() => setModalDelete(false)} ifConfirm={() => removeTaxonomy(url, name)}/>
        </React.Fragment> 
  );
};

export default TableTaxonomy;
