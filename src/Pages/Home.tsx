import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Dropdown, InputGroup } from "react-bootstrap";
import ReactQuill from "react-quill";
import { Modal, Stack } from "react-bootstrap";
import { readAndCompressImage } from "browser-image-resizer";
import { AiOutlineSave, AiOutlineDelete, AiOutlineCloudDownload } from "react-icons/ai";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Sidebar from "../Components/Sidebar";
import ShareModal from "../Components/ShareModal";
import { loadNote } from "../Api";
import { imageConfig, moreOptions, lessOptions, formats } from "../Quill";
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
  const [showLoad, setShowLoad] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [password, setPassword] = useState("");
  const [encodedPassword, setEncodedPassword] = useState("");
  const [modules, setModules] = useState({
    toolbar: moreOptions,
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  });
  const stickyStyle: React.CSSProperties = {
    position: "sticky",
    top: "50px",
    zIndex: "1001",
    backgroundColor: "#f9fbfd",
    paddingBottom: "7px",
  };
  const quillRef = useRef<ReactQuill | null>(null);

  function decodeAndManipulate(encodedString: string): string {
    const decodedString = atob(encodedString);
    const randomStringLength = 16;
    const originalString = decodedString.substring(
      randomStringLength,
      decodedString.length - randomStringLength
    );

    return originalString;
  }

  useEffect(() => {
    if (quillRef && quillRef.current) {
      quillRef.current.getEditor().focus();
    }
  }, [currentId]);

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth <= 450;
      setModules((prevModules) => ({
        ...prevModules,
        toolbar: isMobile ? lessOptions : moreOptions,
      }));
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (quillRef.current != null) {
      const quill = quillRef.current.getEditor();
      quillRef.current.getEditor().focus();

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
    <div className="d-flex flex-column">
      <Sidebar
        notes={notes}
        setNotes={setNotes}
        currentId={currentId}
        setCurrentId={setCurrentId}
      />
      <div className="d-flex w-100">
        <InputGroup>
          <div
            className="d-flex p-2 flex-column w-100 h-100"
            key={currNote?.id}
          >
            <div className="d-flex w-100" style={stickyStyle}>
              <Form.Control
                className="w-50 d-flex"
                name="title"
                value={currNote?.title}
                as="input"
                onChange={(e) => handleInputChange(currNote?.id || 0, e)}
                placeholder="Document Title"
              />
              &nbsp;
              <div className="d-flex align-items-end justify-content-end w-50">
                <div className="d-none d-sm-block">
                  <Button
                    className="p-1 p-sm-2"
                    onClick={() => {
                      currNote?.title && addNote(notes, setNotes, setCurrentId);
                    }}
                  >
                    <HiOutlineDocumentPlus size={22} />
                    &nbsp;New
                  </Button>
                  <Button
                    className="p-1 p-sm-2"
                    variant="warning"
                    onClick={() =>
                      delNote(notes, setCurrentId, setNotes, currNote?.id || 0)
                    }
                  >
                    <AiOutlineDelete size={22} />
                    &nbsp;Delete
                  </Button>
                  <Button className="p-1 p-sm-2" onClick={() => setShow(!show)}>
                    <AiOutlineSave size={22} />
                    &nbsp;Save
                  </Button>
                  <Button
                    className="p-1 p-sm-2"
                    onClick={() => setShowLoad(!showLoad)}
                  >
                    <AiOutlineCloudDownload size={22} />
                    &nbsp;Load
                  </Button>
                </div>
                <div className="d-block d-sm-none">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          currNote?.title &&
                            addNote(notes, setNotes, setCurrentId);
                        }}
                      >
                        New
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          delNote(
                            notes,
                            setCurrentId,
                            setNotes,
                            currNote?.id || 0
                          )
                        }
                      >
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setShow(!show)}>
                        Save
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <ReactQuill
                key={modules.toolbar.length}
                ref={quillRef}
                value={currNote?.body}
                onChange={(value, _delta, _source, editor) =>
                  handleChange(currNote?.id || 0, value, editor.getContents())
                }
                modules={modules}
                formats={formats}
                style={{ position: "sticky", top: "0" }}
              />
            </div>

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
      <Modal
        size="lg"
        centered
        show={showLoad}
        onHide={() => setShowLoad(!showLoad)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Load Note</Modal.Title>
        </Modal.Header>
        <Stack direction="horizontal">
          <Modal.Body>URL:</Modal.Body>
          <Form.Control
            autoFocus
            disabled={remoteId ? true : false}
            type="input"
            id="inputUrl"
            aria-describedby="URL"
            value={shareUrl}
            onChange={(e) => setShareUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const url = new URL(shareUrl);
                const remoteId = url.pathname.split("/")[2];
                const encodedPassword = url.pathname.split("/")[3];
                const loadedNote = loadNote(
                  remoteId,
                  decodeAndManipulate(encodedPassword)
                );
                loadedNote.then((resolvedNote) => {
                  if (resolvedNote) {
                    setNotes([
                      {
                        id: currNote?.id || 0,
                        title: resolvedNote.title,
                        body: resolvedNote.body,
                        image: resolvedNote.image,
                        delta: null,
                      },
                    ]);
                  }
                });
              }
            }}
          />
        </Stack>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoad(!showLoad)}>
            Close
          </Button>
          <Button
            disabled={remoteId ? true : false}
            variant="primary"
            onClick={() => {
              const url = new URL(shareUrl);
              const remoteId = url.pathname.split("/")[2];
              const encodedPassword = url.pathname.split("/")[3];
              const loadedNote = loadNote(
                remoteId,
                decodeAndManipulate(encodedPassword)
              );
              loadedNote.then((resolvedNote) => {
                if (resolvedNote) {
                  setNotes([
                    {
                      id: currNote?.id || 0,
                      title: resolvedNote.title,
                      body: resolvedNote.body,
                      image: resolvedNote.image,
                      delta: null,
                    },
                  ]);
                }
              });
            }}
          >
            Load
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
