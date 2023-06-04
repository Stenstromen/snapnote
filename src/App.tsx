/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import { Quill } from "react-quill";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageResize from "quill-image-resize-module-react";
import Home from "./Pages/Home";
import Share from "./Pages/Share";
import {
  initialNote,
  addNote,
  delNote,
  loadAllNotes,
  saveNote,
} from "./LocalStorage";
import { fetchNotes, postNote } from "./Api";
import { INote } from "./Types";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

Quill.register("modules/imageResize", ImageResize);

function App() {
  const [currentId, setCurrentId] = useState<number>(0);
  const [remoteId, setRemoteId] = useState<string>("");
  const [notes, setNotes] = useState<INote[]>(initialNote);
  const [remote, setRemote] = useState<INote[]>([]);
  const currNote = notes.find((note) => note.id === currentId);

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

  useEffect(() => {
    if (localStorage.length <= 1) return;
    return setNotes(loadAllNotes());
  }, []);

  useEffect(() => {
    saveNote(notes, currentId, currNote);
  }, [notes, saveNote]);

  useEffect(() => {
    setRemoteId("");
  }, [currentId]);

  return (
    <div className="d-flex w-100 main">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                notes={notes}
                setNotes={setNotes}
                currNote={currNote}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                addNote={addNote}
                delNote={delNote}
                postNote={postNote}
                currentId={currentId}
                setCurrentId={setCurrentId}
                remoteId={remoteId}
                setRemoteId={setRemoteId}
              />
            }
          />
          <Route
            path="/share/:id/:token"
            element={
              <Share
                remote={remote}
                setRemote={setRemote}
                fetchNotes={fetchNotes}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
