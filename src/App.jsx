/* eslint-disable no-unused-vars */
import React, { useEffect } from "react"
import dayjs from "dayjs"
import { useState } from "react"
import { FaPen, FaPlus,FaTrash} from "react-icons/fa"
import { Container, Row,Col,Table,Button, Modal, ModalHeader, ModalBody, ModalFooter,Label, Input, UncontrolledTooltip } from "reactstrap"

function App() {
// const divRef=useRef(null)
// const nameRef=useRef(null)
const[isOpen, setIsOpen]=useState(false)
const [inputValue, setInputValue]=useState('')
const [textAreaValue,setTextAreaValue]=useState('')
const [id,setId]=useState('')

// Arrayde saxlamaliyi
const[data,setData]=useState([])
const toggleAddModal=()=>{
  setIsOpen(!isOpen)
  setId("")
}

const onSubmit=e=>{
  e.preventDefault()
 if(!id){
  const newRow={
    id:(data[data.length-1]?.id||0)+1,
    name:inputValue,
    description:textAreaValue,
    createdAt:new Date()
   }
 
 //  kohne datamizi prevState(reactdan gelir) ile gotururk ve sonuna newRow elave edirik 
 setData((prevState=>{
   localStorage.setItem('data',JSON.stringify( [newRow, ...prevState]))
   return  [newRow, ...prevState]
 }))
 //deyerleri goturub forma menimsedirik
 }else{
  const index=data.findIndex(item=>item.id===id)
  // reference  bashqa yer tutsun deye ... verdik
 const newData=[...data]
    newData[index]={
 ...newData[index],
  name:inputValue,
  description:textAreaValue

 }
 setData(newData)
 localStorage.setItem('data',JSON.stringify(newData))
 }
toggleAddModal()
setInputValue('')
setTextAreaValue('')
}

const deleteTodo=(id)=>{
const filterData=data.filter(item=> item.id !==id)
setData(filterData)
localStorage.setItem('data',JSON.stringify(filterData))
}

useEffect(()=>{
  setData(JSON.parse(localStorage.getItem('data')||'[]'))
},[])
// const getRef=()=>{
//   console.log(divRef);
//   console.log(nameRef);
// }
//sehive (companet )acilan kimi ishlesin
// useEffect(()=>{

// },[]) //update bura yaziriq

  return (
    <Container className="mt-5">
      <Modal isOpen={isOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>
        {id? 'Update' : 'Add' }  Form
        </ModalHeader>
        <ModalBody>
          <form  id="add-form" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" onChange={e=>{setInputValue(e.target.value)}} invalid={!inputValue} valid={inputValue.length>3}/>
           <UncontrolledTooltip target='name' placement="button">
            Error
           </UncontrolledTooltip>
            </div>
            <div>
              <Label htmlFor="description"> Description</Label>
              <Input type="textarea" id="description" rows={5} value={textAreaValue} onChange={e=>{ setTextAreaValue(e.target.value)}} invalid={!textAreaValue} valid={textAreaValue.length>3}/>
              <UncontrolledTooltip target='name' placement="button">
            Error
           </UncontrolledTooltip>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
         <Button color="primary" type="submit" form="add-form">Save</Button>
         <Button color="danger" onClick={toggleAddModal} outline >Cansel</Button>
        </ModalFooter>
      </Modal>
   <Row className="justify-content-center">
    <Col sm={12}>
    <Button onClick={toggleAddModal} color='success' className="d-flex align-items-center gap-1">
    <FaPlus />
      Add</Button>
    </Col>
   <Col sm={12} className="mt-2">
    <Table responsive={true} hover={true} bordered={true}>
     <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Description</th>
        <th>Created At</th>
        <th>Actions</th>  
      </tr>
     </thead>
     <tbody>
      
      {data.map((item,index)=>{
       return <tr key={item.id}>
        <td>{index+1}</td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH.mm')}</td>
        <td>
        <div className="d-flex align-items-center gap-1">
        <Button color="success" onClick={()=>{
          toggleAddModal()
          setInputValue(item.name)
          textAreaValue(item.description)
          setId(item.id)
        }}>
            <FaPen className="d-flex"/>
          </Button>
          <Button color="danger" onClick={()=>deleteTodo(item.id)}>
            <FaTrash className="d-flex"/>
          </Button>
        </div>
        </td>
      </tr>
      })}
     </tbody>
    </Table>
   </Col>
   </Row>
   
    </Container>
  )
}

export default App
