export interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

export interface IHomeProps {
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
  postNote: (
    note: INote,
    secret: string,
    setRemoteId: (remoteId: string) => void
  ) => void;
  currentId: number;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
  remoteId: string;
  setRemoteId: React.Dispatch<React.SetStateAction<string>>;
}

export interface IShareProps {
  remote: INote[];
  setRemote: (remote: INote[] | ((remote: INote[]) => INote[])) => void;
  fetchNotes: (
    id: string,
    token: string,
    setRemote: (remote: INote[] | ((remote: INote[]) => INote[])) => void
  ) => void;
}