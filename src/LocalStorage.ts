import { INote } from "./Types";

export const addNote = (setNotes: (arg0: (prevState: any) => any[]) => void) => {
    setNotes((prevState) => [
      ...prevState,
      { id: prevState.length, title: "", body: "", image: null, delta: null },
    ]);
    setCurrentId(notes.length);
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

  export const saveNote = (notes: INote[], note: number, currNote: INote | undefined) => {
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
