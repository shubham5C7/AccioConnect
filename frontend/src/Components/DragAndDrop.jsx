import React, { useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const DragAndDrop = ({ postData, setPostData }) => {
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPostData({ ...postData, contentType: "media" });
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPostData({ ...postData, contentType: "media" });
    }
  };

  const removeFile = () => {
    setFile(null);
    setPostData({ ...postData, contentType: "text" });
    fileRef.current.value = "";
  };

  return (
    <div className="w-full p-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
                style={{
          borderStyle: 'dashed',
          borderSpacing: '10px'
        }}
        className={`cursor-pointer rounded-xl border border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-10
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
              : "border-gray-400 hover:border-blue-400"
          }
        `}
      >
        {!file ? (
          <>
            <FaCloudUploadAlt size={48} className="mb-3 text-blue-500" />
            <p className="font-medium text-lg">Drag & drop your image or video</p>
            <p className="text-sm text-gray-400">or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, JPEG, MP4 (max 50MB)
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">{file.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="flex items-center gap-1 text-red-400 hover:text-red-500 text-sm"
            >
              <RxCross2 size={16} /> Remove file
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default DragAndDrop;
