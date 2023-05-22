import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";

interface INote {
  id: number;
  title: string;
  body: string;
}

function App() {
  const [notes, setNotes] = useState<INote[]>([
    {
      id: 0,
      title: "",
      body: "",
    },
  ]);

  const addNote = () => {
    setNotes((prevState) => [
      ...prevState,
      { id: prevState.length, title: "", body: "" },
    ]);
    console.log(notes);
  };

  /*   const handleAdd = () => {
    setFormData(prevState => [
      ...prevState,
      { id: prevState.length, title: '', body: '' }
    ]);
  }; */

  /*   const handleNotes = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNotes((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }; */

  const handleNotes = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
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

  return (
    <div className="d-flex justify-content-center" style={{
      height: "100vh",
      width: "100vw",
      
    }}>
      <InputGroup className="justify-content-center text-center flex-column" style={{width: "1080px"}}>
        {
          notes.map((note, index) => (
            <div className="p-2" key={note.id}>
              <Form.Control
                name="title"
                value={note.title}
                as="input"
                onChange={(e) => handleNotes(e, index)}
              />
              <Form.Control
                name="body"
                value={note.body}
                as="textarea"
                onChange={(e) => handleNotes(e, index)}
              />
            </div>
          ))
        }
        <Button onClick={addNote}>Add Note</Button>
      </InputGroup>
    </div>
  );
}

export default App;
