import { Edit } from "lucide-react";
import React, { useState, useMemo, memo } from "react";
import Markdown from "react-markdown";
import { noContentMessages } from "../../assets/assets";

const GeneratedOutputSection = memo(({ type, loading, isImage, content }) => {
  const [imageLoading, setImageLoading] = useState(true);

  // Memoize icon and related data to prevent recalculation
  const { Icon, color, name, message } = useMemo(
    () => noContentMessages[type] || {},
    [type]
  );

  return (
    <div
      className={`w-full max-h-[calc(100vh-5.5rem)] shadow-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 ${
        !content || loading ? "h-[600px]" : "h-full"
      }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className={`w-5 h-5 text-${color}`} />}
        <h1 className="text-xl font-semibold capitalize">{name}</h1>
      </div>

      {/* LOADING ANIMATION */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="w-full h-full overflow-hidden bg-gray-200 animate-pulse relative flex items-center justify-center rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
            <span className="text-gray-500">
              {type === "generate-article"
                ? "Generating article with AI..."
                : type === "blog-title"
                ? "Generating blog titles with AI..."
                : type === "generate-image"
                ? "Generating image with AI..."
                : type === "remove-background"
                ? "Removing background with AI..."
                : type === "remove-object"
                ? "Removing object with AI..."
                : type === "review-resume"
                ? "Analyzing resume with AI..."
                : ""}
            </span>
          </div>
        </div>
      ) : !content ? (
        // NO CONTENT MESSAGE
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p>{message}</p>
          </div>
        </div>
      ) : isImage ? (
        // IMAGE WITH SKELETON LOADER
        <div className="mt-3 overflow-auto relative rounded-lg">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-200 animate-pulse relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                <span className="text-gray-500">Loading image...</span>
              </div>
            </div>
          )}
          <img
            src={content}
            alt="generated"
            className={`w-full h-full rounded-lg object-contain transition-opacity duration-500 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </div>
      ) : (
        // MARKDOWN CONTENT
        <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
          <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}

      {/* Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
});

export default GeneratedOutputSection;
