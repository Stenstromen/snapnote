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
  };

  const handleNotes = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    if (index === -1) return;
    if (name === "title" && value.length > 20) return;
    if (name === "body" && value.length > 1000) return;
    if (name === "title" && value.length === 0) return;
    if (name === "body" && value.length === 0) return;
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

  const delNote = (id: number) => {
    setNotes((prevState) => prevState.filter((note) => note.id !== id));
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
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={currNote?.title}
              as="input"
              onChange={(e) => handleNotes(e, currNote?.id || 0)}
            />
            <Form.Label>Body</Form.Label>
            <Form.Control
              rows={20}
              cols={50}
              name="body"
              value={currNote?.body}
              as="textarea"
              onChange={(e) => handleNotes(e, currNote?.id || 0)}
            />
          </div>
        </InputGroup>
        <Button className="p-2" onClick={addNote}>
          Add Note
        </Button>
        <Button className="p-2" onClick={() => delNote(currentId)}>
          Delete Note
        </Button>
      </div>
    </div>
  );
}

export default App;
