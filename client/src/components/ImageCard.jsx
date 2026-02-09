import { Download, Heart } from "lucide-react";
import React, { useState } from "react";
import { ImageCardLoader } from "./common/loaders";

// Card component (memoized for performance)
const ImageCard = React.memo(({ creation, userId, onLike, openGallery }) => {
  const [loaded, setLoaded] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = creation.content;
    link.target = "_blank";
    link.download = "downloaded_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={openGallery}
      className="relative group w-full aspect-square rounded-lg overflow-hidden bg-gray-200 ">
      {/* Loader */}
      {
        !loaded && <ImageCardLoader />
        // <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse">
        //   <svg
        //     className="w-12 h-12 text-gray-50"
        //     viewBox="0 0 20 18"
        //     fill="currentColor">
        //     <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
        //   </svg>
        // </div>
      }

      {/* Image */}
      <img
        src={creation.content}
        alt={creation.prompt || "Community Creation"}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white transition-all duration-500">
        {/* Download */}
        <button
          onClick={handleDownload}
          className="self-end bg-black/50 hover:bg-black/70 p-2 rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer">
          <Download className="w-4 h-4" />
        </button>

        {/* Prompt & likes */}
        <div className="flex justify-end items-end gap-2">
          <p className="text-sm mr-3 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {creation.prompt}
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex  items-center gap-1">
            <p>{creation.likes.length}</p>
            <Heart
              className={`w-4.5 h-4.5 cursor-pointer hover:scale-110 transition ${
                creation.likes.includes(userId)
                  ? "fill-red-500 text-red-600"
                  : "text-white"
              }`}
              onClick={() => onLike(creation.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
export default ImageCard;
