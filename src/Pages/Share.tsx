import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";

interface INote {
  id: number;
  title: string;
  body: string;
  image: string | null;
  delta: object | null;
}

function Share({
  remote,
  fetchNotes,
}: {
  remote: INote[];
  fetchNotes: (id: string, token: string) => void;
}) {
  const { id, token } = useParams<{ token: string; id: string }>();

  function decodeAndManipulate(encodedString: string): string {
    const decodedString = atob(encodedString);
    const randomStringLength = 16;
    const originalString = decodedString.substring(randomStringLength, decodedString.length - randomStringLength);
  
    return originalString;
  }

  useEffect(() => {
    if (id && token) {
      fetchNotes(id, decodeAndManipulate(token));
    }
  }, [id, token]);

  return (
    <div className="d-flex editor">
      <div
        className="d-flex p-2 flex-column editor-content"
        key={remote[0]?.id}
      >
        <h1 className="share-title">{remote[0]?.title}</h1>
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
