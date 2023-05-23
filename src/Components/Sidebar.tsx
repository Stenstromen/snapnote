import Nav from "react-bootstrap/Nav";

function Sidebar({
  notes,
  setCurrentId,
}: {
  notes: { id: number; title: string }[];
  setCurrentId: (id: number) => void;
}) {
  return (
    <div className="sidebar">
      <Nav className="sidebar-content">
        {notes.map(({ id, title }: { id: number; title: string }) => {
          return (
            <Nav.Link key={id} onClick={() => setCurrentId(id)}>
              {title[0] ? title[0].toLocaleUpperCase() : "N"}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

export default Sidebar;
