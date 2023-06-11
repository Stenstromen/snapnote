import { useState } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlineDocumentText, HiOutlineDocument } from "react-icons/hi";
import { INote } from "../Types";
import { delNote } from "../LocalStorage";
import memo from "./memo.png";

function Sidebar({
  notes,
  setNotes,
  currentId,
  setCurrentId,
}: {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
  currentId: number;
  setCurrentId: (id: number) => void;
}) {
  const [show, setShow] = useState(false);
  const iconSize = 28;
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <div className="ms-2 w-100 mt-2">
      <Nav>
        <Button variant="outline-secondary" onClick={toggleShow}>
          <img src={memo} alt="logo" width="30" />
        </Button>
        <h4 className="m-2 text-success">SnapNote.Online</h4>
        <Offcanvas show={show} scroll backdrop onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>SnappNote.Online</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {notes.map(({ id, title }: { id: number; title: string }) => {
              return (
                <Nav.Link
                  className="nav-link-custom"
                  key={id}
                  onClick={() => setCurrentId(id)}
                  style={{ color: id === currentId ? "Green" : "#d3d3d3" }}
                >
                  {title[0] ? (
                    <>
                      <Button
                        variant="outline-danger"
                        className="p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          delNote(notes, setCurrentId, setNotes, id);
                        }}
                      >
                        <AiOutlineDelete size={iconSize} />
                      </Button>{" "}
                      <HiOutlineDocumentText size={iconSize} /> {title}{" "}
                    </>
                  ) : (
                    <>
                      <HiOutlineDocument size={iconSize} /> {title}
                    </>
                  )}
                </Nav.Link>
              );
            })}
          </Offcanvas.Body>
        </Offcanvas>
      </Nav>
    </div>
  );
}

export default Sidebar;
