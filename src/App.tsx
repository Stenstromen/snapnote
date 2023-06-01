/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Share from "./Pages/Share";
import { loadAllNotes, saveNote } from "./LocalStorage";

interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

Quill.register("modules/imageResize", ImageResize);

function App() {
  const initialNote = [
    {
      id: 0,
      title: "Snappy Note",
      body: "<h1>Snappy Note</h1><p>Snappy Note is a simple note taking app that allows you to take notes and share them with others.</p>",
      image: null,
      delta: null,
    },
  ];

  const [currentId, setCurrentId] = useState<number>(0);
  const [remoteId, setRemoteId] = useState<string>("");
  const [notes, setNotes] = useState<INote[]>(initialNote);
  const [remote, setRemote] = useState<INote[]>([]);

  const postNote = async (note: INote, secret: string) => {
    console.log(secret.trim());
    console.log(note);
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/post`,
      note,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: secret.trim(),
        },
      }
    );
    const data = await response.data;
    setRemoteId(data);
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

  const delNote = (id: number) => {
    if (notes.length === 1) return;
    setCurrentId(id - 1);
    setNotes((prevState) => prevState.filter((note) => note.id !== id));
    const sanitizedUrl = window.location.href.replace(
      /[&/\\#,+()$~%.'":*?<>{}]/g,
      ""
    );
    localStorage.removeItem(`${sanitizedUrl}_note_${id}`);
  };

  useEffect(() => {
    if (localStorage.length <= 1) return;
    return setNotes(loadAllNotes());
  }, []);

  const currNote = notes.find((note) => note.id === currentId);

  useEffect(() => {
    console.log(currNote);
    saveNote(notes, currentId, currNote);
  }, [notes, saveNote]);

  useEffect(() => {
    setRemoteId("");
  }, [currentId]);

  const fetchNotes = async (id: string, token: string): Promise<void> => {
    console.log(id);
    console.log(token);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = response.data;
      setRemote((remote) => [...remote, data]);
      console.log("fetching remote");
      console.log(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <div className="d-flex w-100 main">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                notes={notes}
                currNote={currNote}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                addNote={addNote}
                delNote={delNote}
                postNote={postNote}
                currentId={currentId}
                setCurrentId={setCurrentId}
                remoteId={remoteId}
              />
            }
          />
          <Route
            path="/share/:id/:token"
            element={<Share remote={remote} fetchNotes={fetchNotes} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
