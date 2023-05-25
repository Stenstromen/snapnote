/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

function Home({
  currNote,
  handleChange,
  handleInputChange,
  addNote,
  delNote,
  postNote,
  currentId,
}: {
  currNote: INote | undefined;
  handleChange: (index: number, value: string, delta: object) => void;
  handleInputChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  addNote: () => void;
  delNote: (id: number) => void;
  postNote: (note: INote) => void;
  currentId: number;
}) {
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: 1 }],
      [{ header: 2 }],
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
  return (
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
              <Button className="p-1" onClick={() => postNote(currNote!)}>
                Save Note
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
      {/*         <ReactQuill
      value={remote[0]?.body}
      modules={modules}
      formats={formats}
      placeholder="Body"
    />
    <Button onClick={fetchNotes}>Fetch Notes</Button> */}
    </div>
  );
}

export default Home;
