import React, { useState, useEffect} from 'react'
import { Card, Form, Row } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import Alert from '../../components/Alert/Alert';
import FormState from './components/FormState'
import Navigation from '../../components/Navigation/Navigation'
import { putState} from "../../api/services/states";
import { getAllStates} from "../../api/services/states";
import ListEdge from '../edge/ListEdge';


const EditState = () => {
    const location = useLocation();
    const fromState = location.state;
    const[body,setBody]=useState(fromState);

    const [error,setError]=useState()
    const [states, setStates] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
    const [edge, setEdge] = useState()

    const [sectionAddEdge, setSectionAddEdge] = useState(false);


    useEffect( ()=> {
        if(body.children !== []){
            setSectionAddEdge(true)
        }
        const fetchPosts = async () => {
            getAllStates().then((response) => { 

                var listChildren = []
                response.map((state)=>{
                    if (state.url !== body.url){
                        listChildren.push({value:state.url, label:state.name})
                    }
                })
                setStates(listChildren)
              })
              .catch((error) => {
                  setError(error)
                  
              })
        }  
        fetchPosts()
        
    },[]);
    const resetShowAlert = () => {
        setShowAlert(false);
    }

    const editState= ()=>{
        putState(body.url, body.name, body.attended, body.solved, body.active, body.description, body.children)
        .then(() => {
            window.location.href = '/states';
        })
        .catch((error) => {
            setShowAlert(true) 
            setError(error);           
        })
    }
  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={() => setShowAlert(false)} component="state"/>
        <Row>
            <Navigation actualPosition="Editar Estado" path="/states" index ="Estados"/> 
        </Row>
        <FormState body={body} setBody={setBody} edge ={edge } createState={editState} childernes={states} type ={"Editar"}/>         
        <ListEdge url={body.url} sectionAddEdge={sectionAddEdge} setShowAlert={setShowAlert} />
    </div>
  )
}
export default EditState
