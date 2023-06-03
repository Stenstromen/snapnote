export const imageConfig = {
    quality: 0.7,
    maxWidth: 800,
    maxHeight: 800,
    autoRotate: true,
    debug: true,
  };

export const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: 1 }],
      [{ header: 2 }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    imageResize: {
      modules: ["Resize", "DisplaySize"],
    },
  };

export const formats = [
    "font",
    "size",
    "header",
    "color",
    "background",
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
    "clean",
  ];