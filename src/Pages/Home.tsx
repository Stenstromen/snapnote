import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";
import ReactQuill from "react-quill";
import { readAndCompressImage } from "browser-image-resizer";
import { AiOutlineSave, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Sidebar from "../Components/Sidebar";
import ShareModal from "../Components/ShareModal";
import { imageConfig, modules, formats } from "../Quill";
import "react-quill/dist/quill.snow.css";
import { IHomeProps } from "../Types";

function Home({
  notes,
  setNotes,
  currNote,
  handleChange,
  handleInputChange,
  addNote,
  delNote,
  currentId,
  setCurrentId,
  remoteId,
  setRemoteId,
}: IHomeProps) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [encodedPassword, setEncodedPassword] = useState("");

  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (quillRef.current != null) {
      const quill = quillRef.current.getEditor();

      quill.getModule("toolbar").addHandler("image", () => {
        const fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.click();

        fileInput.onchange = async () => {
          if (fileInput.files === null) {
            console.warn("No files selected");
            return;
          }
          const file = fileInput.files[0];

          try {
            const compressedFile = await readAndCompressImage(
              file,
              imageConfig
            );

            const reader = new FileReader();
            reader.onload = function (e) {
              const range = quill.getSelection();
              const position = range ? range.index : 0;

              if (e.target === null) {
                console.warn("No target");
                return;
              }
              quill.insertEmbed(position, "image", e.target.result, "user");
            };
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            console.error("Failed to compress and resize image", error);
          }
        };
      });
    }
  }, []);

  return (
    <>
      <Sidebar
        notes={notes}
        currentId={currentId}
        setCurrentId={setCurrentId}
      />
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
                <Button
                  className="p-1"
                  onClick={() => addNote(notes, setNotes, setCurrentId)}
                >
                  <HiOutlineDocumentPlus size={22} />
                </Button>
                <Button
                  className="p-1"
                  variant="warning"
                  onClick={() =>
                    delNote(notes, setCurrentId, setNotes, currNote?.id || 0)
                  }
                >
                  <AiOutlineDelete size={22} />
                </Button>
                <Button className="p-1" onClick={() => setShow(!show)}>
                  <AiOutlineSave size={22} />
                </Button>
              </div>
            </div>

            <ReactQuill
              ref={quillRef}
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
        <ShareModal
          show={show}
          setShow={setShow}
          currNote={currNote}
          remoteId={remoteId}
          setRemoteId={setRemoteId}
          password={password}
          setPassword={setPassword}
          encodedPassword={encodedPassword}
          setEncodedPassword={setEncodedPassword}
        />
      </div>
    </>
  );
}

export default Home;
