import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import FormEvent from './components/FormEvent'
import Navigation from '../../components/Navigation/Navigation'
import { postEvent} from "../../api/services/events";
import { getMinifiedTlp } from "../../api/services/tlp";
import { getMinifiedTaxonomy } from "../../api/services/taxonomies";
import { getMinifiedFeed } from "../../api/services/feeds";
import { getMinifiedPriority } from "../../api/services/priorities";
import { getMinifiedUser } from "../../api/services/users";
import { getMinifiedArtifact } from "../../api/services/artifact";
import { getMinifiedCase, getCases } from "../../api/services/cases";
import Alert from '../../components/Alert/Alert';


const CreateEvent = () => {
  const formEmpty={   
    children: [], 
    todos: [],
    artifacts: [], 
    comments: null, // verificar aca si escribo y borro todo, se envia "" lo mismo para notes
    address_value:"", //requerido
    date: "",       //requerido
    notes: "", 
    parent: [], 
    priority: "" ,  //requerido
    tlp: "",        //requerido 
    taxonomy: "",   //requerido
    feed: "",       //requerido
    reporter: [],
    case: "",
    tasks:[]
  }  
  const [body, setBody] = useState(formEmpty)
  const [evidence, setEvidence] = useState([])
  const [TLP, setTLP] = useState([])
  const [feeds, setFeeds] = useState([])
  const [taxonomy, setTaxonomy] = useState([])
  const [priorities, setPriorities] = useState([])
  const [users, setUsers] = useState([])
  const [cases, setCases] = useState([])
  const [listArtifact, setListArtifact] = useState([])
  const [contactCreated, setContactsCreated ] = useState(null);
  const [showAlert, setShowAlert] = useState(false)
  const [updateCases, setUpdateCases] = useState("")

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState("-created");
  const [wordToSearch, setWordToSearch] = useState("");
  const [selectedCases, setSelectedCases] = useState([]);
  const [ifModify, setIfModify] = useState(null) 

  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [tlpNames, setTlpNames] = useState({});
  const [priorityNames, setPriorityNames] = useState({});
  const [stateNames, setStateNames] = useState({});
  const [userNames, setUserNames] = useState({});

  const resetShowAlert = () => {
    setShowAlert(false);
  }  

  useEffect( ()=> {
    const fetchPosts = async () => {
        
        getMinifiedTlp().then((response) => {
          let listTlp = []
          let dicTlp = {}
          response.map((tlp) => {
            listTlp.push({value:tlp.url, label:tlp.name})
            dicTlp[tlp.url]={name:tlp.name, color:tlp.color}
          })
          setTLP(listTlp)
          setTlpNames(dicTlp) 
        })
        .catch((error) => {
            setShowAlert(true) //hace falta?
            console.log(error)
            
        })

        getMinifiedTaxonomy().then((response) => { 
          let listTaxonomies = []
          response.map((taxonomy) => {
            listTaxonomies.push({value:taxonomy.url, label:taxonomy.name})
          })
          setTaxonomy(listTaxonomies)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedFeed().then((response) => { //se hardcodea las paginas
          let listFeed = []
          response.map((feed) => {
            listFeed.push({value:feed.url, label:feed.name})
          })
          setFeeds(listFeed)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedPriority().then((response) => { //se hardcodea las paginas
          let priorityOp = []
            let dicPriority={}
            response.map((priority) => {
                priorityOp.push({value: priority.url, label: priority.name})
                dicPriority[priority.url]= priority.name
            })
            setPriorityNames(dicPriority)
          setPriorities(priorityOp)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedUser().then((response) => { //se hardcodea las paginas
          let listUser = []
          let dicUser={}
          response.map((user) => {
            listUser.push({value:user.url, label:user.username})
            dicUser[user.url]= user.username
          })
          setUsers(listUser)
          setUserNames(dicUser)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedArtifact()
        .then((response) => {
          var list= []
          response.map((artifact)=>{
            list.push({value:artifact.url, label:artifact.value})
          })
          setListArtifact(list)
        })
        .catch((error)=>{
          console.log(error)
        }) 
        
    }  
    fetchPosts()
    
  },[contactCreated, updateCases]);

  useEffect( ()=> {
    getCases(currentPage, priorityFilter+wordToSearch, order) 
            .then((response) => {
                setCases(response.data.results)
                //setCountItems(response.data.count);
                // Pagination
                //if(currentPage === 1){
                   // setUpdatePagination(true)  
                //}
                //setDisabledPagination(false)
                
            })
            .catch((error) => {
            })
            .finally(() => {
                setShowAlert(true)
                setLoading(false)
            })
    
  },[wordToSearch , priorityFilter, currentPage]);

  const createEvent=()=>{
    
    const formDataEvent = new FormData();
    console.log(body.date)

    formDataEvent.append("date", body.date)// tengo que hacer esto porque solo me acepta este formato, ver a futuro
    formDataEvent.append("priority",body.priority)
    formDataEvent.append("tlp", body.tlp)
    formDataEvent.append("taxonomy", body.taxonomy)
    formDataEvent.append("feed", body.feed)
    formDataEvent.append("todos", body.todos)
    formDataEvent.append("comments", body.comments)
    formDataEvent.append("notes", body.notes)
    formDataEvent.append("parent", body.parent)
    formDataEvent.append("reporter", body.reporter)
    formDataEvent.append("case", body.case) 
    formDataEvent.append("tasks", body.tasks)
    formDataEvent.append("address_value", body.address_value)
    if (evidence !== null){
      for (let index=0; index< evidence.length  ; index++){
        formDataEvent.append("evidence", evidence[index])
        console.log(evidence[index])
      }
    }else{
      formDataEvent.append("evidence", evidence)
    }
    //no se estan enviando los artefactos revisar backend
    body.artifacts.forEach((item) => {
      formDataEvent.append('artifacts', item);
    });

    postEvent(formDataEvent)
      .then(() => {
        window.location.href = '/events';
    })
    .catch((error) => {
        setShowAlert(true)
        console.log(error)         
    })  
  }

  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert} component="event"/>
        <Row>
          <Navigation actualPosition="Agregar evento" path="/events" index ="Evento"/>
        </Row>
        <FormEvent createEvent={createEvent} setBody={setBody} body={body} 
                    feeds={feeds} taxonomy={taxonomy} tlp={TLP} priorities={priorities} 
                    users={users} listArtifact={listArtifact} setContactsCreated={setContactsCreated} 
                    evidence={evidence} setEvidence={setEvidence} cases={cases}
                    setUpdateCases={setUpdateCases} loading={loading} setLoading={setLoading}
                    order={order} setOrder={setOrder} setIfModify={setIfModify} tlpNames={tlpNames}
                    selectedCases={selectedCases} setSelectedCases={setSelectedCases}
                    setWordToSearch={setWordToSearch} wordToSearch={wordToSearch}
                    priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                    currentPage={currentPage} setCurrentPage={setCurrentPage}
                    priorityNames={priorityNames} setPriorityNames={setPriorityNames}
                    stateNames={stateNames} setStateNames={setStateNames}
                    userNames={userNames} setUserNames={setUserNames}/>
          
    </div>
  )
}

export default CreateEvent