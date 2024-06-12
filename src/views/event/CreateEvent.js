import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import FormEvent from './components/FormEvent'
import Navigation from '../../components/Navigation/Navigation'
import { postEvent } from "../../api/services/events";
import { getMinifiedTlp } from "../../api/services/tlp";
import { getMinifiedTaxonomy } from "../../api/services/taxonomies";
import { getMinifiedFeed } from "../../api/services/feeds";
import { getMinifiedPriority } from "../../api/services/priorities";
import { getMinifiedUser } from "../../api/services/users";
import { getMinifiedArtifact } from "../../api/services/artifact";
import Alert from '../../components/Alert/Alert';
<<<<<<< HEAD
import { useTranslation, Trans } from 'react-i18next';
=======
>>>>>>> develop

const CreateEvent = () => {
  const formEmpty = {
    children: [],
    todos: [],
    artifacts: [],
    comments: null, // verificar aca si escribo y borro todo, se envia "" lo mismo para notes
    address_value: "", //requerido
    date: "",       //requerido
    notes: "",
    parent: [],
    priority: "",  //requerido
    tlp: "",        //requerido 
    taxonomy: "",   //requerido
    feed: "",       //requerido
    reporter: [],
    case: "",
    tasks: []
  }
  const [body, setBody] = useState(formEmpty)
  const [evidence, setEvidence] = useState([])
  const [TLP, setTLP] = useState([])
  const [feeds, setFeeds] = useState([])
  const [taxonomy, setTaxonomy] = useState([])
  const [priorities, setPriorities] = useState([])
  
  const [listArtifact, setListArtifact] = useState([])
<<<<<<< HEAD
  const [contactCreated, setContactsCreated] = useState(null);
=======
  const [contactCreated, setContactsCreated ] = useState(null);

  const [tlpNames, setTlpNames] = useState({});
  const [priorityNames, setPriorityNames] = useState({});
  const [userNames, setUserNames] = useState({});
>>>>>>> develop
  const [showAlert, setShowAlert] = useState(false)

  const { t } = useTranslation();

  const resetShowAlert = () => {
    setShowAlert(false);
  }

<<<<<<< HEAD
  useEffect(() => {
    const fetchPosts = async () => {

      getMinifiedTlp().then((response) => {
        let listTlp = []
        response.map((tlp) => {
          listTlp.push({ value: tlp.url, label: tlp.name })
=======
  useEffect( ()=> {
        
        getMinifiedTlp().then((response) => {
          let listTlp = []
          let dicTlp = {}
          response.map((tlp) => {
            listTlp.push({value:tlp.url, label:tlp.name})
            dicTlp[tlp.url]={name:tlp.name, color:tlp.color}
          })
          setTLP(listTlp)
          setTlpNames(dicTlp) 
>>>>>>> develop
        })
        setTLP(listTlp)
      })
        .catch((error) => {
          setShowAlert(true) //hace falta?
          console.log(error)

        })

<<<<<<< HEAD
      getMinifiedCase().then((response) => {
        let list = []
        response.map((item) => {
          list.push({ value: item.url, label: item.name + ": " + item.uuid })
        })
        setCases(list)
      })
        .catch((error) => {
          console.log(error)

        })

      getMinifiedTaxonomy().then((response) => {
        let listTaxonomies = []
        response.map((taxonomy) => {
          listTaxonomies.push({ value: taxonomy.url, label: taxonomy.name })
=======
        getMinifiedTaxonomy().then((response) => { 
          let listTaxonomies = []
          response.map((taxonomy) => {
            listTaxonomies.push({value:taxonomy.url, label:taxonomy.name})
          })
          setTaxonomy(listTaxonomies)
>>>>>>> develop
        })
        setTaxonomy(listTaxonomies)
      })
        .catch((error) => {
          console.log(error)

        })

      getMinifiedFeed().then((response) => { //se hardcodea las paginas
        let listFeed = []
        response.map((feed) => {
          listFeed.push({ value: feed.url, label: feed.name })
        })
        setFeeds(listFeed)
      })
        .catch((error) => {
          console.log(error)

        })

<<<<<<< HEAD
      getMinifiedPriority().then((response) => { //se hardcodea las paginas
        let listPriority = []
        response.map((priority) => {
          listPriority.push({ value: priority.url, label: priority.name })
=======
        getMinifiedPriority().then((response) => { //se hardcodea las paginas
            let priorityOp = []
            let dicPriority={}
            response.map((priority) => {
                priorityOp.push({value: priority.url, label: priority.name})
                dicPriority[priority.url]= priority.name
            })
            setPriorityNames(dicPriority)
            setPriorities(priorityOp)
>>>>>>> develop
        })
        setPriorities(listPriority)
      })
        .catch((error) => {
          console.log(error)

        })

<<<<<<< HEAD
      getMinifiedUser().then((response) => { //se hardcodea las paginas
        let listUser = []
        response.map((user) => {
          listUser.push({ value: user.url, label: user.username })
=======
        getMinifiedUser().then((response) => { //se hardcodea las paginas
          let dicUser={}
          response.map((user) => {
            dicUser[user.url]= user.username
          })
          setUserNames(dicUser)
>>>>>>> develop
        })
        setUsers(listUser)
      })
        .catch((error) => {
          console.log(error)

        })

      getMinifiedArtifact()
        .then((response) => {
          var list = []
          response.map((artifact) => {
            list.push({ value: artifact.url, label: artifact.value })
          })
          setListArtifact(list)
        })
        .catch((error) => {
          console.log(error)
<<<<<<< HEAD
        })

    }
    fetchPosts()

  }, [contactCreated, updateCases]);

  const createEvent = () => {
=======
        }) 
    
  },[contactCreated]);
>>>>>>> develop

    const formDataEvent = new FormData();

    formDataEvent.append("date", body.date)// tengo que hacer esto porque solo me acepta este formato, ver a futuro
    formDataEvent.append("priority", body.priority)
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
    if (evidence !== null) {
      for (let index = 0; index < evidence.length; index++) {
        formDataEvent.append("evidence", evidence[index])
        console.log(evidence[index])
      }
    } else {
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
<<<<<<< HEAD
      <Alert showAlert={showAlert} resetShowAlert={resetShowAlert} component="event" />
      <Row>
        <Navigation actualPosition={t('ngen.event.add')} path="/events" index={t('ngen.event_one')} />
      </Row>
      <FormEvent createEvent={createEvent} setBody={setBody} body={body}
        feeds={feeds} taxonomy={taxonomy} tlp={TLP} priorities={priorities}
        users={users} listArtifact={listArtifact} setContactsCreated={setContactsCreated}
        evidence={evidence} setEvidence={setEvidence} cases={cases}
        setUpdateCases={setUpdateCases} />

=======
        <Alert showAlert={showAlert} resetShowAlert={resetShowAlert} component="event"/>
        <Row>
          <Navigation actualPosition="Agregar evento" path="/events" index ="Evento"/>
        </Row>
        <FormEvent createEvent={createEvent} setBody={setBody} body={body} 
                    feeds={feeds} taxonomy={taxonomy} tlp={TLP} priorities={priorities} 
                    listArtifact={listArtifact} setContactsCreated={setContactsCreated} 
                    evidence={evidence} setEvidence={setEvidence} 
                    tlpNames={tlpNames}
                    priorityNames={priorityNames} setPriorityNames={setPriorityNames}
                    userNames={userNames} />
>>>>>>> develop
    </div>
  )
}
export default CreateEvent