/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import Sidebar from "./Components/Sidebar";

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

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: 1}],
      [{ header: 2}],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  };

  const formats = [
    "font",
    "size",
    "header",
    "color",
    "background",
    "blockquote",
    "code-block",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "image",
    "link",
    "clean",
  ];

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
    <div className="d-flex w-100 main">
      <Sidebar notes={notes} setCurrentId={setCurrentId} />
      <div className="d-flex editor">
        <InputGroup>
          <div
            className="d-flex p-2 flex-column editor-content"
            key={currNote?.id}
          >
            <div className="d-flex ">
              <Form.Control
                className="w-50 d-flex"
                name="title"
                value={currNote?.title}
                as="input"
                onChange={(e) => handleInputChange(currNote?.id || 0, e)}
                placeholder="asdfsadf"
              />
              &nbsp;
              <div className="flex-end">
                <Button className="p-1" onClick={addNote}>
                  New Note
                </Button>
                &nbsp;
                <Button
                  className="p-1"
                  variant="warning"
                  onClick={() => delNote(currentId)}
                >
                  Del Note
                </Button>
              </div>
            </div>

            <ReactQuill
              value={currNote?.body}
              onChange={(value, _delta, _source, editor) =>
                handleChange(currNote?.id || 0, value, editor.getContents())
              }
              modules={modules}
              formats={formats}
              placeholder="Body"
            />
            {currNote?.image && <img src={currNote?.image} alt="Uploaded" />}
          </div>
        </InputGroup>
      </div>
    </div>
  );
}

export default App;
