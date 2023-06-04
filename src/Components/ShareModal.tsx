/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Modal, Button, Form, Stack, Nav } from "react-bootstrap";
import { IShareModalProps } from "../Types";
import { postNote } from "../Api";

async function generateRandomBytes(length: number): Promise<Uint8Array> {
  const crypto = window.crypto || window.Crypto;

  if (!crypto || !crypto.getRandomValues) {
    throw new Error("Web Crypto API not available.");
  }

  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return randomBytes;
}

async function manipulateAndEncode(input: string): Promise<string> {
  const randomBytesResult = await generateRandomBytes(8);
  const randomString = Array.from(randomBytesResult)
    .map((byte) => byte.toString(16))
    .join("");

  const manipulatedString = randomString + input + randomString;

  const encodedString = btoa(manipulatedString);

  return encodedString;
}

function ShareModal({
  show,
  setShow,
  currNote,
  remoteId,
  setRemoteId,
  password,
  setPassword,
  encodedPassword,
  setEncodedPassword,
}: IShareModalProps) {
  return (
  <Modal size="lg" centered show={show} onHide={() => setShow(!show)}>
    <Modal.Header closeButton>
      <Modal.Title>Save Note</Modal.Title>
    </Modal.Header>
    <Stack direction="horizontal">
      <Modal.Body>Pass:</Modal.Body>
      <Form.Control
        autoFocus
        disabled={remoteId ? true : false}
        type="password"
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            postNote(currNote!, password, setRemoteId);
            manipulateAndEncode(password).then((encodedResult) => {
              setEncodedPassword(encodedResult);
            });
          }
        }}
      />
    </Stack>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShow(!show)}>
        Close
      </Button>
      <Button
        disabled={remoteId ? true : false}
        variant="primary"
        onClick={() => {
          postNote(currNote!, password, setRemoteId);
          manipulateAndEncode(password).then((encodedResult) => {
            setEncodedPassword(encodedResult);
          });
        }}
      >
        Save Changes
      </Button>
    </Modal.Footer>
    <Modal.Footer>
      {remoteId ? (
        <Nav variant="pills" activeKey="1">
          <Nav.Item>
            <Nav.Link
              target="_blank"
              href={`${
                window.document.URL
              }share/${remoteId.trim()}/${encodedPassword}`}
            >
              {`${
                window.document.URL
              }share/${remoteId.trim()}/${encodedPassword}`}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      ) : null}
    </Modal.Footer>
  </Modal>
  );
}

export default ShareModal;
