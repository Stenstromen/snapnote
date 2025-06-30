import { useEffect, useRef } from 'react';
import Quill from 'quill';
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from '../Quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string, delta: object) => void;
  readOnly?: boolean;
  modules?: {
    toolbar: any;
    imageResize?: {
      modules: string[];
    };
  };
  formats?: string[];
  style?: React.CSSProperties;
}

const QuillEditor = ({
  value,
  onChange,
  readOnly = false,
  modules = { toolbar: false },
  formats,
  style
}: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const editor = new Quill(editorRef.current, {
        theme: 'snow',
        modules: modules,
        formats: formats,
        readOnly: readOnly,
      });

      if (!readOnly && modules.toolbar) {
        const toolbar = editor.getModule('toolbar') as { addHandler: (type: string, handler: () => void) => void };
        toolbar.addHandler('image', () => {
          const fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.click();

          fileInput.onchange = async () => {
            if (!fileInput.files) {
              console.warn('No files selected');
              return;
            }
            const file = fileInput.files[0];

            try {
              const compressedFile = await readAndCompressImage(file, imageConfig);
              const reader = new FileReader();
              reader.onload = function (e) {
                const range = editor.getSelection();
                const position = range ? range.index : 0;

                if (e.target === null) {
                  console.warn('No target');
                  return;
                }
                editor.insertEmbed(position, 'image', e.target.result, 'user');
              };
              reader.readAsDataURL(compressedFile);
            } catch (error) {
              console.error('Failed to compress and resize image', error);
            }
          };
        });
      }

      editor.on('text-change', () => {
        const html = editor.root.innerHTML;
        const delta = editor.getContents();
        onChange(html, delta);
      });

      quillRef.current = editor;
    }

    return () => {
      if (quillRef.current) {
        // Clean up Quill instance
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current;
      const currentContent = editor.root.innerHTML;
      
      if (value !== currentContent) {
        editor.root.innerHTML = value;
      }
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div style={style}>
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor; 