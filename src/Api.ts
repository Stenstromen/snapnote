import axios from "axios";
import { INote } from "./Types";

export const postNote = async (
  note: INote,
  token: string,
  setRemoteId: (remoteId: string) => void
) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/post`,
    note,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token.trim(),
      },
    }
  );
  const data = await response.data;
  setRemoteId(data);
};

export const fetchNotes = async (
  id: string,
  token: string,
  setRemote: (remote: INote[] | ((remote: INote[]) => INote[])) => void
): Promise<void> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/get/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const data = response.data;
    setRemote((remote) => [...remote, data]);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};
