/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import Sidebar from "./Components/Sidebar";

interface INote {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [currentId, setCurrentId] = useState<number>(0);
  const [notes, setNotes] = useState<INote[]>([
    {
      id: 0,
      title: "asdf",
      body: "asdf",
    },
  ]);

  const addNote = () => {
    setNotes((prevState) => [
      ...prevState,
      { id: prevState.length, title: "", body: "" },
    ]);
    console.log(notes);
  };

  const handleNotes = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    setNotes((prevState) => {
      const updatedData = [...prevState];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };
      return updatedData;
    });
  };

  const loadNote = () => {
    const notes = localStorage.getItem("notes");
    if (notes) {
      setNotes(JSON.parse(notes));
    }
  };

  useEffect(() => {
    loadNote();
  }, []);

  const saveNote = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  useEffect(() => {
    saveNote();
  }, [notes, saveNote]);

  const currNote = notes.find((note) => note.id === currentId);

  return (
    <div className="d-flex">
      <Sidebar notes={notes} setCurrentId={setCurrentId} />
      <div className="flex-grow-1">
        <InputGroup>
          <div className="p-2" key={currNote?.id}>
            <Form.Control
              name="title"
              value={currNote?.title}
              as="input"
              onChange={(e) => handleNotes(e, currNote?.id || 0)}
            />
            <Form.Control
              name="body"
              value={currNote?.body}
              as="textarea"
              onChange={(e) => handleNotes(e, currNote?.id || 0)}
            />
          </div>
          <Button onClick={addNote}>Add Note</Button>
        </InputGroup>
      </div>
    </div>
  );
}

export default App;
