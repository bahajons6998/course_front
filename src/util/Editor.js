import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Editor({ change_template_info, name, initialData = "" }) {
  const [editorData, setEditorData] = useState(initialData);
  console.log(initialData)
  return (
    <div>
      <CKEditor
      
        editor={ClassicEditor}
        data={initialData}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "undo",
            "redo",
          ],
          ckfinder: {
            uploadUrl: "http://localhost:5000/api/uploads",
            options: {
              resourceType: "Images",
            },
          },
          image: {
            toolbar: [
              "imageStyle:full",
              "imageStyle:side",
              "|",
              "imageTextAlternative",
              "|",
              "resizeImage:50",
              "resizeImage:75",
              "resizeImage:original",
            ],
            resizeOptions: [
              {
                name: "resizeImage:original",
                value: null,
                label: "Asl o'lcham",
              },
              {
                name: "resizeImage:50",
                value: "50",
                label: "50%",
              },
              {
                name: "resizeImage:75",
                value: "75",
                label: "75%",
              },
            ],
            resizeUnit: "%", // O'lcham foizda
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          console.log("Editor ichida o'zgartirish:", data);
          change_template_info({
            target: {
              name,
              value: data,
            },
          }, 'description');
        }}
        onReady={(editor) => {
          console.log("Editor tayyor!", editor);
          editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return {
              upload: () => {
                return loader.file.then(
                  (file) =>
                    new Promise((resolve, reject) => {
                      const data = new FormData();
                      data.append("upload", file);
                      fetch("http://localhost:5000/api/uploads", {
                        method: "POST",
                        body: data,
                      })
                        .then((response) => response.json())
                        .then((result) => {
                          console.log("Backend javobi:", result);
                          if (result.uploaded) {
                            resolve({ default: result.url });
                          } else {
                            reject(new Error(result.error || "Fayl yuklashda xatolik"));
                          }
                        })
                        .catch((error) => {
                          console.error("Yuklash xatosi:", error);
                          reject(error);
                        });
                    })
                );
              },
            };
          };
        }}
        onError={(error, { willEditorRestart }) => {
          console.error("CKEditor xatoligi:", error);
          if (willEditorRestart) {
            console.warn("Editor qayta ishga tushiriladi");
          }
        }}
      />
    </div>
  );
}

export default Editor;