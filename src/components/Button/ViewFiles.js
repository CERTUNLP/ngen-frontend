import React, { useState, useEffect } from 'react';
import { getEvidence, deleteEvidence } from '../../api/services/evidences';
import { Button } from 'react-bootstrap';

const ViewFiles = (props) => {
    const [data, setData] = useState({})

    useEffect( ()=> { 
        getEvidence(props.url)
        .then((response) => {
            setData(response.data)
        })
        .catch();

    },[])

    const openFile = () => {
        window.open(data.file, props.index);;
    }

    const deleteFile = () => {
        deleteEvidence(props.url)
            .then((response) => {
                console.log(response.data)
                //no mostrar button
            })
            
    }

    return (
        <>
            <Button 
                className='text-capitalize' 
                variant='light'
                title={'Evidencia '+ props.index} 
                onClick={openFile} 
                size="sm">
                <i className="fas fa-external-link-alt"/>
                <p>Nombre: {data.original_filename}</p>
                <p>Mime:   {data.mime}</p>
                <p>Tamaño: {data.size}</p>
                <p>Fecha de creacion: {data.created ? data.created.slice(0,10)+" "+data.created.slice(11,19): ""}</p>
            </Button>
            <Button 
                size='sm'
                className='btn-icon btn-rounded' 
                variant='outline-danger'
                title={'Eliminar evidencia '+ props.index}
                onClick={deleteFile}>
                    <i className='fas fa-trash-alt' />
            </Button> 
        </>
        
    )
    }

export default ViewFiles;
/*
            <Badge 
                    variant='danger'
                    title={'Eliminar evidencia '+ props.index}
                    onClick={deleteFile}>
                        <i className='fas fa-trash-alt' />
                </Badge> 
*/
/* EL DEL MERGE
<Col> 
                                <Button 
                                    disabled={selectedCases.length > 1 ? false : true}
                                    size="sm"
                                    className='text-capitalize'
                                    variant='light'
                                    title='Mergear'
                                    onClick={() => mergeConfirm()}>
                                    <i variant='danger' className="fa fa-code-branch"/>
                                        Merge&nbsp;
                                    <Badge  
                                        className="badge mr-1" >
                                        {selectedCases.length} 
                                    </Badge>
                                </Button>                                
                            </Col> 

*/