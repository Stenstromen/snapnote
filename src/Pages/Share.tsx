/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import { IShareProps } from "../Types";

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  value?: any;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  modules?: any;
}

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

  const Editor = forwardRef<Quill, EditorProps>(
    ({ readOnly = false, defaultValue, value, onTextChange, onSelectionChange, modules }, ref) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const defaultValueRef = useRef(defaultValue);
      const valueRef = useRef(value);
      const onTextChangeRef = useRef(onTextChange);
      const onSelectionChangeRef = useRef(onSelectionChange);
      const quillInstanceRef = useRef<Quill | null>(null);
      const isUserInputRef = useRef(false);
  
      useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
        valueRef.current = value;
      }, [onTextChange, onSelectionChange, value]);
  
      useEffect(() => {
        if (quillInstanceRef.current) {
          quillInstanceRef.current.enable(!readOnly);
        }
      }, [readOnly]);
  
      useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';
        
        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div'),
        );
        
        const quill = new Quill(editorContainer, {
          theme: 'snow',
          modules: modules || {},
        });

        quillInstanceRef.current = quill;
  
        if (typeof ref === 'object' && ref) {
          ref.current = quill;
        }
  
        // Set initial content
        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        } else if (valueRef.current) {
          // Handle both HTML and Delta content
          if (typeof valueRef.current === 'string') {
            // If it's HTML content, convert it to Delta format
            quill.clipboard.dangerouslyPasteHTML(valueRef.current);
          } else {
            // If it's already Delta format
            quill.setContents(valueRef.current);
          }
        }
  
        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
          isUserInputRef.current = true;
          onTextChangeRef.current?.(...args);
          // Reset the flag after a short delay
          setTimeout(() => {
            isUserInputRef.current = false;
          }, 100);
        });
  
        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
          onSelectionChangeRef.current?.(...args);
        });
  
        return () => {
          if (typeof ref === 'object' && ref) {
            ref.current = null;
          }
          quillInstanceRef.current = null;
          container.innerHTML = '';
        };
      }, []); // Remove modules dependency to prevent recreation
  
      // Update content when value changes without recreating the editor
      useEffect(() => {
        if (quillInstanceRef.current && value !== undefined && !isUserInputRef.current) {
          const currentContents = quillInstanceRef.current.getContents();
          let newContents = value;
          
          // Handle both HTML and Delta content
          if (typeof value === 'string') {
            // If it's HTML content, we need to convert it to Delta format for comparison
            const tempQuill = new Quill(document.createElement('div'));
            tempQuill.clipboard.dangerouslyPasteHTML(value);
            newContents = tempQuill.getContents();
          }
          
          // Only update if content actually changed and it's not from user input
          // This prevents the editor from updating itself when the user is typing
          if (JSON.stringify(currentContents) !== JSON.stringify(newContents)) {
            // Store current selection
            const selection = quillInstanceRef.current.getSelection();
            
            if (typeof value === 'string') {
              // If it's HTML content, convert it to Delta format
              quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
            } else {
              // If it's already Delta format
              quillInstanceRef.current.setContents(value);
            }
            
            // Restore selection if it existed
            if (selection) {
              quillInstanceRef.current.setSelection(selection);
            }
          }
        }
      }, [value]);
  
      return <div ref={containerRef}></div>;
    },
  );

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
        <Editor
          value={remote[0]?.body}
          readOnly={true}
          modules={{ toolbar: false }}
        />
      </div>
    </div>
  );
}

export default Share;
