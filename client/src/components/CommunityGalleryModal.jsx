import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ImageCard from "./ImageCard";

const CommunityGalleryModal = ({
  isOpen,
  onClose,
  creations,
  startIndex = 0,
  userId,
  onLike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  if (!isOpen) return null;

  const current = creations[currentIndex];

  return (
    /* 🔹 Overlay (click closes modal) */
    <div
      className="fixed inset-0 z-20 bg-black/90 flex items-center justify-center"
      onClick={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-30">
        <X size={28} />
      </button>

      {/* 🔹 Modal content (stop click bubbling) */}
      <div
        className="flex flex-row justify-center"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Container */}
        <div className="w-full md:w-2xl lg:max-w-5xl max-h-[80vh] flex flex-col items-center px-4">
          {/* Image Section */}
          <ImageCard
            key={current.id}
            creation={current}
            userId={userId}
            onLike={onLike}
            /* no openGallery here */
          />

          {/* Thumbnails */}
          <div className="mt-3 h-24 shrink-0 overflow-x-auto">
            <div className="flex gap-3">
              {creations.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    i === currentIndex
                      ? "border-green-400"
                      : "border-transparent"
                  }`}>
                  <img
                    src={c.content}
                    alt=""
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGalleryModal;
