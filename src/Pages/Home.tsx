import { useEffect, useRef, useState, forwardRef, useLayoutEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Dropdown, InputGroup } from "react-bootstrap";
import Quill from "quill";
import { Modal, Stack } from "react-bootstrap";
import { readAndCompressImage } from "browser-image-resizer";
import { AiOutlineSave, AiOutlineDelete, AiOutlineCloudDownload } from "react-icons/ai";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import Sidebar from "../Components/Sidebar";
import ShareModal from "../Components/ShareModal";
import { loadNote } from "../Api";
import { imageConfig, moreOptions, lessOptions, formats } from "../Quill";
import "quill/dist/quill.snow.css";
import { IHomeProps } from "../Types";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  value?: any;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  modules?: any;
}

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
  const quillRef = useRef<Quill | null>(null);

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
      quillRef.current.focus();
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
      const quill = quillRef.current;
      quill.focus();

      const toolbar = quill.getModule("toolbar") as any;
      if (toolbar && toolbar.addHandler) {
        toolbar.addHandler("image", () => {
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
    }
  }, []);

  const Editor = forwardRef<Quill, EditorProps>(
    ({ readOnly = false, defaultValue, value, onTextChange, onSelectionChange, modules }, ref) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const defaultValueRef = useRef(defaultValue);
      const valueRef = useRef(value);
      const onTextChangeRef = useRef(onTextChange);
      const onSelectionChangeRef = useRef(onSelectionChange);
      const quillInstanceRef = useRef<Quill | null>(null);
      const isUserInputRef = useRef(false);
  
      useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
        valueRef.current = value;
      }, [onTextChange, onSelectionChange, value]);
  
      useEffect(() => {
        if (quillInstanceRef.current) {
          quillInstanceRef.current.enable(!readOnly);
        }
      }, [readOnly]);
  
      useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';
        
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div'),
        );
        
        const quill = new Quill(editorContainer, {
          theme: 'snow',
          modules: modules || {},
          formats: formats,
        });

        quillInstanceRef.current = quill;
  
        if (typeof ref === 'object' && ref) {
          ref.current = quill;
        }
  
        // Set initial content
        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        } else if (valueRef.current) {
          // Handle both HTML and Delta content
          if (typeof valueRef.current === 'string') {
            // If it's HTML content, convert it to Delta format
            quill.clipboard.dangerouslyPasteHTML(valueRef.current);
          } else {
            // If it's already Delta format
            quill.setContents(valueRef.current);
          }
        }
  
        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
          isUserInputRef.current = true;
          onTextChangeRef.current?.(...args);
          // Reset the flag after a short delay
          setTimeout(() => {
            isUserInputRef.current = false;
          }, 100);
        });
  
        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
          onSelectionChangeRef.current?.(...args);
        });
  
        return () => {
          if (typeof ref === 'object' && ref) {
            ref.current = null;
          }
          quillInstanceRef.current = null;
          container.innerHTML = '';
        };
      }, []); // Remove modules dependency to prevent recreation
  
      // Update content when value changes without recreating the editor
      useEffect(() => {
        if (quillInstanceRef.current && value !== undefined && !isUserInputRef.current) {
          const currentContents = quillInstanceRef.current.getContents();
          let newContents = value;
          
          // Handle both HTML and Delta content
          if (typeof value === 'string') {
            // If it's HTML content, we need to convert it to Delta format for comparison
            const tempQuill = new Quill(document.createElement('div'));
            tempQuill.clipboard.dangerouslyPasteHTML(value);
            newContents = tempQuill.getContents();
          }
          
          // Only update if content actually changed and it's not from user input
          // This prevents the editor from updating itself when the user is typing
          if (JSON.stringify(currentContents) !== JSON.stringify(newContents)) {
            // Store current selection
            const selection = quillInstanceRef.current.getSelection();
            
            if (typeof value === 'string') {
              // If it's HTML content, convert it to Delta format
              quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
            } else {
              // If it's already Delta format
              quillInstanceRef.current.setContents(value);
            }
            
            // Restore selection if it existed
            if (selection) {
              quillInstanceRef.current.setSelection(selection);
            }
          }
        }
      }, [value]);
  
      return <div ref={containerRef}></div>;
    },
  );

  const handleEditorChange = (delta: any, oldContents: any, source: any) => {
    if (quillRef.current && currNote) {
      const html = quillRef.current.root.innerHTML;
      handleChange(currNote.id, html, quillRef.current.getContents());
    }
  };

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
            <div className="d-flex" style={{ position: "sticky", top: "0" }}>
              <Editor
                ref={quillRef}
                value={currNote?.body}
                onTextChange={handleEditorChange}
                modules={modules}
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
