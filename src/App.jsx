/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";

function App() {
  // State-ləri təyin edirik
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState([]);

  // Modal-ı açıb-bağlamaq üçün funksiyanı təyin edirik
  const toggleAddModal = () => {
    setIsOpen(!isOpen);
    setId("");
  };

  // Formu göndərmək üçün funksiyanı təyin edirik
  const onSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      // Əgər id yoxdursa, yeni məlumat əlavə edirik
      const newRow = {
        id: (data[data.length - 1]?.id || 0) + 1, // Yeni id təyin edirik
        name: inputValue,
        description: textAreaValue,
        createdAt: new Date(),
      };

      // Yeni məlumatı mövcud dataya əlavə edirik
      setData((prevState) => {
        const updatedData = [newRow, ...prevState];
        localStorage.setItem("data", JSON.stringify(updatedData)); // Yenilənmiş məlumatı localStorage-a yazırıq
        return updatedData;
      });
    } else {
      // Əgər id varsa, mövcud məlumatı redaktə edirik
      const index = data.findIndex((item) => item.id === id);
      const newData = [...data];
      newData[index] = {
        ...newData[index],
        name: inputValue,
        description: textAreaValue,
      };
      setData(newData);
      localStorage.setItem("data", JSON.stringify(newData)); // Yenilənmiş məlumatı localStorage-a yazırıq
    }

    // Formu bağlayırıq və input-ları sıfırlayırıq
    toggleAddModal();
    setInputValue("");
    setTextAreaValue("");
  };

  // Məlumatı silmək üçün funksiyanı təyin edirik
  const deleteTodo = (id) => {
    const filterData = data.filter((item) => item.id !== id);
    setData(filterData);
    localStorage.setItem("data", JSON.stringify(filterData)); // Yenilənmiş məlumatı localStorage-a yazırıq
  };

  // Komponent yüklənərkən localStorage-dan məlumatı oxuyuruq
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("data") || "[]"));
  }, []);

  return (
    <Container className="mt-5">
      <Modal isOpen={isOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>
          {id ? "Update" : "Add"} Form
        </ModalHeader>
        <ModalBody>
          <form id="add-form" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                invalid={!inputValue}
                valid={inputValue.length > 3}
              />
              <UncontrolledTooltip target="name" placement="bottom">
                Error
              </UncontrolledTooltip>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                rows={5}
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                invalid={!textAreaValue}
                valid={textAreaValue.length > 3}
              />
              <UncontrolledTooltip target="description" placement="bottom">
                Error
              </UncontrolledTooltip>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" form="add-form">
            Save
          </Button>
          <Button color="danger" onClick={toggleAddModal} outline>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Row className="justify-content-center">
        <Col sm={12}>
          <Button
            onClick={toggleAddModal}
            color="success"
            className="d-flex align-items-center gap-1"
          >
            <FaPlus />
            Add
          </Button>
        </Col>
        <Col sm={12} className="mt-2">
          <Table responsive hover bordered>
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
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <Button
                        color="success"
                        onClick={() => {
                          toggleAddModal();
                          setInputValue(item.name);
                          setTextAreaValue(item.description);
                          setId(item.id);
                        }}
                      >
                        <FaPen />
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => deleteTodo(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
