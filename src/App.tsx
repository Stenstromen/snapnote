/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
/* import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap"; */
import Sidebar from "./Components/Sidebar";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

Quill.register("modules/imageResize", ImageResize);

function App() {
  const [currentId, setCurrentId] = useState<number>(0);
  const [notes, setNotes] = useState<INote[]>([
    {
      id: 0,
      title: "asdf",
      body: "asdf",
      image: null,
      delta: null,
    },
  ]);
  const [remote, setRemote] = useState<INote[]>([]);

  const postNote = async (note: INote) => {
    console.log(note);
    const response = await axios.post("http://localhost:8080/post", note);
    const data = await response.data;
    console.log(data);
  };

  const addNote = () => {
    setNotes((prevState) => [
      ...prevState,
      { id: prevState.length, title: "", body: "", image: null, delta: null },
    ]);
    setCurrentId(notes.length);
  };

  const handleChange = (index: number, value: string, delta: object) => {
    setNotes((prevState) => {
      const updatedData = [...prevState];
      updatedData[index].body = value;
      updatedData[index].delta = delta;
      return updatedData;
    });
  };

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const delNote = (id: number) => {
    if (notes.length === 1) return;
    setCurrentId(id - 1);
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

  const fetchNotes = async () => {
    const response = await axios.get("http://localhost:8080/get/o6sg1uwd", {
      headers: {
        Authorization: "123",
      },
    });
    const data = await response.data;
    setRemote((remote) => [...remote, data]);
    console.log(data);
  };

  /*  useEffect(() => {
    fetchNotes();
  }, []); */

  return (
    <div className="d-flex w-100 main">
      <BrowserRouter>
        <Sidebar notes={notes} setCurrentId={setCurrentId} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                currNote={currNote}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                addNote={addNote}
                delNote={delNote}
                postNote={postNote}
                currentId={currentId}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;