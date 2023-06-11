type ModulesType = {
  toolbar: string[][] | (string | { [key: string]: unknown })[][];
  imageResize: { modules: string[] };
};

export const imageConfig = {
  quality: 0.7,
  maxWidth: 800,
  maxHeight: 800,
  autoRotate: true,
  debug: true,
};

export const moreOptions: ModulesType["toolbar"] = [
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: 1 }],
  [{ header: 2 }],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  ["blockquote", "code-block"],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
  ["link", "image", "video"],
  ["clean"],
];

export const lessOptions: ModulesType["toolbar"] = [
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

export const formats = [
  "font",
  "size",
  "header",
  "color",
  "background",
  "script",
  "blockquote",
  "code-block",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "image",
  "link",
  "video",
  "clean",
];
