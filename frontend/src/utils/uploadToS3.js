import axios from "axios";

const uploadToS3 = async (file) => {
  try {
    if (!file) throw new Error("No file selected");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, WEBP, GIF, MP4, MOV allowed");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      throw new Error("File must be under 5MB");
    }

    // Get presigned URL
    const { data } = await axios.post(
      "http://localhost:3000/upload/uploadFile",
      {
        fileName: file.name,
        fileType: file.type,
      }
    );

    const { uploadUrl, key, permanentUrl } = data.data;

    // Upload to S3
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

      console.log("Upload complete!");
    return { key, permanentUrl };
  } catch (err) {
    console.error("File Upload Error:", err);

    throw new Error(
      err.response?.data?.message || err.message || "File upload failed"
    );
  }
};

export default uploadToS3;