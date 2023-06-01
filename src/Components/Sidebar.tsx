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
  const iconSize = 28;
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
                <HiOutlineDocumentText size={iconSize} />
              ) : (
                <HiOutlineDocument size={iconSize} />
              )}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

export default Sidebar;
