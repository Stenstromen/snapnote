/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { IShareProps } from "../Types";

function Share({ remote, setRemote, fetchNotes }: IShareProps) {
  const { id, token } = useParams<{ token: string; id: string }>();

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
    if (id && token) {
      fetchNotes(id, decodeAndManipulate(token), setRemote);
    }
  }, [id, token]);

  return (
    <div className="d-flex"
    style={{
      margin: "0 auto",
    }}>
      <div
        className="d-flex flex-column editor-content"
        key={remote[0]?.id}
      >
        <h1 className="text-dark">{remote[0]?.title}</h1>
        <ReactQuill
          value={remote[0]?.body}
          readOnly={true}
          theme="snow"
          modules={{ toolbar: false }}
        />
      </div>
    </div>
  );
}

export default Share;
