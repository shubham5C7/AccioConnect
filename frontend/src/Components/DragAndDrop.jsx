import React, { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import uploadToS3 from "../utils/uploadToS3";


const DragAndDrop = ({ postData, setPostData }) => {
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

    // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const processFile = async(selectedFile)=>{
    if(!selectedFile || uploading) return;

  try{
  setUploading(true);

  //Preview
  const previewUrl =URL.createObjectURL(selectedFile);
  setFilePreview(previewUrl);

  // Upload to S3
  const {permanentUrl} = await uploadToS3(selectedFile);

        // Determine content type
      const contentType = selectedFile.type.startsWith("video/") ? "video" : "image";


  // save URl in postData
  setPostData(prev => ({
    ...prev,
 content:permanentUrl,
   contentType: contentType, 
  }));
  }catch(err){
console.error("Upload failed:", err);
  // Clean up preview on error
  if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
       setFilePreview(null);
  }finally{
     setUploading(false);
  }
  };

  const handleDrop = (e) => {
    e.preventDefault();
     setIsDragging(false); 
        const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    processFile(selected);
  };

const removeFile = () => {

  if(filePreview){
    URL.revokeObjectURL(filePreview);
  }

  setFilePreview(null);

  setPostData(prev => ({
    ...prev,
     content: "",
      contentType: "text",
  }));

     if (fileRef.current) {
      fileRef.current.value = "";
    }
};



  return (
    <div className="w-full p-6">
      <div
          onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
       onClick={() => !uploading && fileRef.current?.click()}  
        className={`cursor-pointer rounded-xl border border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-10
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
              : "border-gray-400 hover:border-blue-400"
          }
          ${uploading && "opacity-60 cursor-not-allowed"}
        `}
      >
        {!filePreview ? (
          <>
            <FaCloudUploadAlt size={48} className="mb-3 text-blue-500" />
            {uploading ? (
              <p className="font-medium text-lg">Uploading...</p>
            ) :(
              <> 
                              <p className="font-medium text-lg">
                 Drag & drop your image/video 
                </p>
                 <p className="text-sm text-gray-400">
                  or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                 PNG, JPG, WEBP, GIF, MP4, MOV (max 5MB)
                </p>
              </>
            )

            }
          </>
        ) : (
          <div className="relative">
                 <img
              src={filePreview}
              alt="preview"
              className="max-h-44 rounded-lg object-cover"
            />
               {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
              >
                <RxCross2 />
              </button>
            )}
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
