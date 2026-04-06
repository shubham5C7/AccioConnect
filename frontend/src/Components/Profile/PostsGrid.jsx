import React, { useState } from "react";

const isImageUrl = (str) => {
  if (!str) return false;
  return (
    str.match(/\.(jpeg|jpg|gif|png|webp|jfif)(\?.*)?$/i) ||
    str.includes("amazonaws.com") ||
    str.includes("cloudinary.com") ||
    str.startsWith("data:image/")
  );
};

const PostsGrid = ({ posts, loading }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (!posts || posts.length === 0)
    return <div className="text-center py-10 text-gray-500">No posts found.</div>;

  const imagePosts = posts.filter((post) => isImageUrl(post.content));

  if (imagePosts.length === 0)
    return <div className="text-center py-10 text-gray-500">No images found.</div>;

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-2">
        {imagePosts.map((post) => (
          <div
            key={post._id}
            className="aspect-square overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(post.content)}
          >
            <img
              src={post.content}
              alt="post"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>

          {/* Enlarged Image */}
          <img
            src={selectedImage}
            alt="enlarged"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default PostsGrid;