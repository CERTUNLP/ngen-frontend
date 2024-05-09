import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap';
import FormEvent from './components/FormEvent'
import Navigation from '../../components/Navigation/Navigation'
import { putEvent, patchEvent} from "../../api/services/events";
import { useLocation } from "react-router-dom";
import Alert from '../../components/Alert/Alert';
import { getMinifiedTlp } from "../../api/services/tlp";
import { getMinifiedTaxonomy } from "../../api/services/taxonomies";
import { getMinifiedFeed } from "../../api/services/feeds";
import { getMinifiedPriority } from "../../api/services/priorities";
import { getEvidence, deleteEvidence} from "../../api/services/evidences";
import { getMinifiedUser } from "../../api/services/users";
import { getMinifiedArtifact } from "../../api/services/artifact";
import { getMinifiedCase } from "../../api/services/cases";

const EditEvent = () => {
  //const [date, setDate] = useState(caseItem.date  != null ? caseItem.date.substr(0,16) : '') //required
    const location = useLocation();
    const fromState = location.state;
    const [event, setEvent] = useState(fromState);  
    const [body,setBody]=useState(event)
    const [evidence, setEvidence] = useState([])
    const [TLP, setTLP] = useState([])
    const [feeds, setFeeds] = useState([])
    const [taxonomy, setTaxonomy] = useState([])
    const [cases, setCases] = useState([])
    const [priorities, setPriorities] = useState([])
    const [users, setUsers] = useState([])
    const [listArtifact, setListArtifact] = useState([])
    const [contactCreated, setContactsCreated ] = useState(null);
    const [showAlert, setShowAlert] = useState(false)
    const [selectCase, setSelectCase] = useState()
  useEffect( ()=> {
    
    let dicCase={}

    const fetchPosts = async () => {


        var list = []
        event.evidence.forEach((url) => {
           
          getEvidence(url).then((response) => { 
                list.push(response.data)
            })
          
        });
        setEvidence(list)
        
        
        getMinifiedTlp().then((response) => { 
          let listTlp = []
          response.map((tlp) => {
            listTlp.push({value:tlp.url, label:tlp.name})
          })
          setTLP(listTlp)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedCase().then((response) => { 
          let list = []
          response.map((item) => {
            list.push({value:item.url, label:item.name+": "+item.uuid})
            dicCase[item.url]= item.name+": "+item.uuid
          })
          setCases(list)
        })
        .catch((error) => {
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
          let listPriority = []
          response.map((priority) => {
            listPriority.push({value:priority.url, label:priority.name})
          })
          setPriorities(listPriority)
        })
        .catch((error) => {
          console.log(error)
            
        })

        getMinifiedUser().then((response) => { //se hardcodea las paginas
          let listUser = []
          response.map((user) => {
            listUser.push({value:user.url, label:user.username})
          })
          setUsers(listUser)
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
    event.date = event.date.substr(0,16)
    event.case =  event.case ? event.case : ""
    //event.reporter = event.reporter == null ? "": event.reporter
    //event.domain = event.domain == null ? "": event.domain
    //event.cidr = event.cidr == null ? "": event.cidr
    /*if (event.case !== null){
      setSelectCase({value:event.case, label: dicCase[event.case]})
    }*/
   
    setBody(event)
    
  },[contactCreated]);
  

    const resetShowAlert = () => {
      setShowAlert(false);
    }

    const editEvent=()=>{
      const formDataEvent = new FormData();

      console.log(body.children.length)

      if (body.children.length === 0  ){
        console.log(body.children)
        console.log("guarda que entro aca")
        //se eliminan las evidencias
        if (evidence instanceof FileList){
          event.evidence.forEach((url) => {
            deleteEvidence(url).then((response) => { 
                  console.log(response)
              })
          });
        }
        //console.log(fecha.toISOString())//YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
        
        formDataEvent.append("date", body.date)// tengo que hacer esto porque solo me acepta este formato, ver a futuro
        //f.append("date", fecha.toISOString())
        formDataEvent.append("priority",body.priority)
        formDataEvent.append("tlp", body.tlp)
        formDataEvent.append("taxonomy", body.taxonomy)
        body.artifacts.forEach((item) => {
          formDataEvent.append('artifacts', item);
        });
        formDataEvent.append("feed", body.feed)
        formDataEvent.append("address_value", body.address_value)
        formDataEvent.append("case", body.case)
        formDataEvent.append("todos", body.todos)
        formDataEvent.append("comments", body.comments)
        //f.append("cidr", body.cidr)// 'null' does not appear to be an IPv4 or IPv6 network"
        formDataEvent.append("notes", body.notes)
        //f.append("parent", body.parent) //"Invalid hyperlink - No URL match."]
        formDataEvent.append("reporter", body.reporter)
        //f.append("case", body.case) //"Invalid hyperlink - No URL match.
        formDataEvent.append("tasks", body.tasks)

        if (evidence !== null){
          for (let index=0; index< evidence.length  ; index++){
            formDataEvent.append("evidence", evidence[index])
        
          }
        }else{
          formDataEvent.append("evidence", evidence)
        }
        //formDataEvent.append('artifacts',body.artifacts);


      putEvent(body.url,formDataEvent).then(() => {
        //window.location.href = '/events';
        console.log(body)
      })
      .catch((error) => {
          setShowAlert(true) //hace falta?
          console.log(error)        
      }) 
    }else{
      if (evidence instanceof FileList){
        event.evidence.forEach((url) => {
          deleteEvidence(url).then((response) => { 
                console.log(response)
            })
        });
      }
      //console.log(fecha.toISOString())//YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
      
      formDataEvent.append("date", body.date)// tengo que hacer esto porque solo me acepta este formato, ver a futuro
      //f.append("date", fecha.toISOString())
      formDataEvent.append("priority",body.priority)
      formDataEvent.append("tlp", body.tlp)
      //formDataEvent.append("taxonomy", body.taxonomy)
      if(body.artifacts.length > 0){
        body.artifacts.forEach((item) => {
          formDataEvent.append('artifacts', item);
        });
      }
      //formDataEvent.append("feed", body.feed)
      //formDataEvent.append("address_value", body.address_value)
      formDataEvent.append("case", body.case)
      formDataEvent.append("todos", body.todos)
      formDataEvent.append("comments", body.comments)
      //f.append("cidr", body.cidr)// 'null' does not appear to be an IPv4 or IPv6 network"
      formDataEvent.append("notes", body.notes)
      //f.append("parent", body.parent) //"Invalid hyperlink - No URL match."]
      formDataEvent.append("reporter", body.reporter)
      //f.append("case", body.case) //"Invalid hyperlink - No URL match.
      formDataEvent.append("tasks", body.tasks)

      if (evidence !== null){
        for (let index=0; index< evidence.length  ; index++){
          formDataEvent.append("evidence", evidence[index])
      
        }
      }else{
        formDataEvent.append("evidence", evidence)
      }
      //formDataEvent.append('artifacts',body.artifacts);


      patchEvent(body.url,formDataEvent).then(() => {
        window.location.href = '/events';
        console.log(body)
      })
      .catch((error) => {
          setShowAlert(true) //hace falta?
          console.log(error)        
      })

    }
      
         
    }

  return (
    <div>
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert} component="event"/>
        <Row>
          <Navigation actualPosition="Editar Evento " path="/events" index ="Evento"/>
        </Row>
        <FormEvent createEvent={editEvent} setBody={setBody} body={body} feeds={feeds} 
                  taxonomy={taxonomy} tlp={TLP} priorities={priorities} users={users} 
                  listArtifact={listArtifact} setContactsCreated={setContactsCreated} 
                  evidence={evidence} setEvidence={setEvidence} cases={cases} 
                  selectCase={selectCase} setSelectCase={setSelectCase}/>
    </div>
  )
}

export default EditEvent