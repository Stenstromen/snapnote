import { INote } from "./Types";

export const initialNote = [
  {
    id: 0,
    title: "Snappy Note",
    body: "<h1>Snappy Note</h1><p>Snappy Note is a simple note taking app that allows you to take notes and share them with others.</p>",
    image: null,
    delta: null,
  },
];

export const addNote = (
  notes: INote[],
  setNotes: (notes: INote[] | ((prevState: INote[]) => INote[])) => void,
  setCurrentId: (currentId: number) => void
) => {
  setNotes((prevState: INote[]) => [
    ...prevState,
    { id: prevState.length, title: "", body: "", image: null, delta: null },
  ]);
  setCurrentId(notes.length);
};

export const delNote = (
  notes: INote[],
  setCurrentId: (currentId: number) => void,
  setNotes: (notes: INote[] | ((prevState: INote[]) => INote[])) => void,
  id: number
) => {
  if (notes.length === 1) return;

  const newNotes = notes.filter((note) => note.id !== id);
  setNotes(newNotes);

  const nextNote = newNotes[newNotes.length - 1];
  setCurrentId(nextNote ? nextNote.id : 0);

  const sanitizedUrl = window.location.href.replace(
    /[&/\\#,+()$~%.'":*?<>{}]/g,
    ""
  );
  localStorage.removeItem(`${sanitizedUrl}_note_${id}`);
};


export const loadAllNotes = () => {
  const sanitizedUrl = window.location.href.replace(
    /[&/\\#,+()$~%.'":*?<>{}]/g,
    ""
  );
  const keys = Object.keys(localStorage);
  const notes = keys.reduce((acc: INote[], key) => {
    if (key.startsWith(`${sanitizedUrl}_note_`)) {
      const item = localStorage.getItem(key);
      if (item) {
        acc.push(JSON.parse(item));
      }
    }
    return acc;
  }, []);
  return notes;
};

export const saveNote = (
  notes: INote[],
  note: number,
  currNote: INote | undefined
) => {
  const sanitizedUrl = window.location.href.replace(
    /[&/\\#,+()$~%.'":*?<>{}]/g,
    ""
  );
  if (notes.length === 0) return loadAllNotes();
  localStorage.setItem(
    `${sanitizedUrl}_note_${note}`,
    JSON.stringify(currNote)
  );
};
