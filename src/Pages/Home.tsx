/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { Stack, Button, InputGroup, Modal, Nav } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Sidebar from "../Components/Sidebar";
import { readAndCompressImage } from "browser-image-resizer";
import { AiOutlineSave, AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDocumentPlus } from "react-icons/hi2";

interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

function Home({
  notes,
  setNotes,
  currNote,
  handleChange,
  handleInputChange,
  addNote,
  delNote,
  postNote,
  currentId,
  setCurrentId,
  remoteId,
}: {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
  currNote: INote | undefined;
  handleChange: (index: number, value: string, delta: object) => void;
  handleInputChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  addNote: (
    notes: INote[],
    setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
    setCurrentId: (currentId: number) => void
  ) => void;
  delNote: (
    notes: INote[],
    setCurrentId: (currentId: number) => void,
    setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
    id: number
  ) => void;
  postNote: (note: INote, secret: string) => void;
  currentId: number;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
  remoteId: string;
}) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [encodedPassword, setEncodedPassword] = useState("");

  const quillRef = useRef<ReactQuill | null>(null);

  const config = {
    quality: 0.7,
    maxWidth: 800,
    maxHeight: 800,
    autoRotate: true,
    debug: true,
  };

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

  async function generateRandomBytes(length: number): Promise<Uint8Array> {
    const crypto = window.crypto || window.Crypto;

    if (!crypto || !crypto.getRandomValues) {
      throw new Error("Web Crypto API not available.");
    }

    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return randomBytes;
  }

  async function manipulateAndEncode(input: string): Promise<string> {
    // Generate 8 random characters
    const randomBytesResult = await generateRandomBytes(8);
    const randomString = Array.from(randomBytesResult)
      .map((byte) => byte.toString(16))
      .join("");

    // Prepend and append the random characters to the input
    const manipulatedString = randomString + input + randomString;

    // Encode the manipulated string to base64
    const encodedString = btoa(manipulatedString);

    return encodedString;
  }

  useEffect(() => {
    if (quillRef.current != null) {
      const quill = quillRef.current.getEditor();

      // Add the custom handler here
      quill.getModule("toolbar").addHandler("image", () => {
        // trigger the file input dialog
        const fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.click();

        fileInput.onchange = async () => {
          if (fileInput.files === null) {
            console.warn("No files selected");
            return;
          }
          const file = fileInput.files[0];

          // compress and resize the image
          try {
            const compressedFile = await readAndCompressImage(file, config);

            // convert the Blob into a data URL
            const reader = new FileReader();
            reader.onload = function (e) {
              // get the cursor position
              const range = quill.getSelection();
              const position = range ? range.index : 0;

              // insert the image
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
              ref={quillRef} // Pass the ref to the Quill component
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
        <Modal size="lg" centered show={show} onHide={() => setShow(!show)}>
          <Modal.Header closeButton>
            <Modal.Title>Save Note</Modal.Title>
          </Modal.Header>
          <Stack direction="horizontal">
            <Modal.Body>Pass:</Modal.Body>
            <Form.Control
              autoFocus
              disabled={remoteId ? true : false}
              type="password"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  postNote(currNote!, password);
                  manipulateAndEncode(password).then((encodedResult) => {
                    setEncodedPassword(encodedResult);
                  });
                }
              }}
            />
          </Stack>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(!show)}>
              Close
            </Button>
            <Button
              disabled={remoteId ? true : false}
              variant="primary"
              onClick={() => {
                postNote(currNote!, password);
                manipulateAndEncode(password).then((encodedResult) => {
                  setEncodedPassword(encodedResult);
                });
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
          <Modal.Footer>
            {remoteId ? (
              <Nav variant="pills" activeKey="1">
                <Nav.Item>
                  <Nav.Link
                    target="_blank"
                    href={`${
                      window.document.URL
                    }share/${remoteId.trim()}/${encodedPassword}`}
                  >
                    {`${
                      window.document.URL
                    }share/${remoteId.trim()}/${encodedPassword}`}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            ) : null}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Home;
