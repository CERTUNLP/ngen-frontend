import React,{ useState} from 'react'
import {
    Button,Card, Table , Modal, Row,Col, Form, Badge,CloseButton, Spinner
  } from 'react-bootstrap';
import CrudButton from '../../../components/Button/CrudButton';
import {Link} from 'react-router-dom'

import Alert from '../../../components/Alert/Alert';
import CallBackendByName from '../../../components/CallBackendByName'; 
import { getAllTaxonomies, getTaxonomy } from "../../../api/services/taxonomies";
import { deleteReport } from "../../../api/services/reports";
import ModalConfirm from '../../../components/Modal/ModalConfirm';

const TableReport = ({list, loading, currentPage}) => {
 
    const [dataState,setDataState] = useState({})
    const [showState, setShowState] = useState()
    const [showAlert, setShowAlert] = useState(false)

    const [deleteUrl, setDeleteUrl] = useState()
    const [remove, setRemove] = useState()
    const [deleteName, setDeleteName] = useState("")
    const [error, setError] = useState(null);

    if (loading) {
        return (
            <Row className='justify-content-md-center'>
                <Spinner animation='border' variant='primary' size='sm' />
            </Row>
        );    
    }

    const resetShowAlert = () => {
        setShowAlert(false);
    }

    const modalDelete = ( url)=>{
        setDeleteUrl(url) 
        setRemove(true)
    }

    const handleDelete = () => {
        deleteReport(deleteUrl).then(() => {
            window.location.href = '/reports';
          })
          .catch((error) => {
            setError(error);
          })
    }

    const callbackTaxonomy = (url ,setPriority) => {
        getTaxonomy(url)
        .then((response) => {
         
            setPriority(response.data)
        })
        .catch();
    }
      
      
  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert}/>  
       
                <ul className="list-group my-4">
                    <Table responsive hover className="text-center">
                        <thead>
                            <tr>
                                <th>#</th>
                               
                                <th>Taxonomia</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((report, index) => {
                            return (
                                        <tr>
                                            <th >{ 1+index+10*(currentPage-1) }</th>
                                           
                                            <td><CallBackendByName url={report.taxonomy} callback={callbackTaxonomy} useBadge={false}/></td>
                                            <td>
                                            <CrudButton type='read' onClick={() => console.log("aaa")} />
                                            <Link to={{pathname:'/reports/edit', state: report}} >
                                                <CrudButton type='edit'/>
                                            </Link>
                                            <CrudButton type='delete' onClick={() => modalDelete( report.url)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </Table>
                    <ModalConfirm type='delete' component='Reporte' name={deleteName} showModal={remove} onHide={() => setRemove(false)} ifConfirm={() => handleDelete(deleteUrl)}/> 
                </ul>
           
    </div>
  )
}

export default TableReport