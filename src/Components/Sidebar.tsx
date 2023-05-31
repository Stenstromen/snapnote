import Nav from "react-bootstrap/Nav";
import { HiOutlineDocumentText, HiOutlineDocument } from "react-icons/hi";

function Sidebar({
  notes,
  currentId,
  setCurrentId,
}: {
  notes: { id: number; title: string }[];
  currentId: number;
  setCurrentId: (id: number) => void;
}) {
  return (
    <div className="sidebar">
      <Nav className="sidebar-content">
        {notes.map(({ id, title }: { id: number; title: string }) => {
          return (
            <Nav.Link
            className="nav-link-custom"
              key={id}
              onClick={() => setCurrentId(id)}
              style={{ color: id === currentId ? "Green" : "White" }}
            >
              {title[0] ? (
                <HiOutlineDocumentText size={22} />
              ) : (
                <HiOutlineDocument size={22} />
              )}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

export default Sidebar;
