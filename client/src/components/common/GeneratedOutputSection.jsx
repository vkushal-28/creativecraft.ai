import { Edit } from "lucide-react";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { noContentMessages } from "../../assets/assets";

const GeneratedOutputSection = ({ type, loading, isImage, content }) => {
  const Icon = noContentMessages[type].Icon;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      className={`w-full max-h-[calc(100vh-5.5rem)] shadow-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 ${
        !content || loading ? "h-[600px]" : "h-full"
      }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-5 h-5 text-${noContentMessages[type].color}`} />
        <h1 className="text-xl font-semibold capitalize">
          {noContentMessages[type].name}
        </h1>
      </div>

      {/* LOADING ANIMATION */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="w-full h-full overflow-hidden bg-gray-200 animate-pulse relative flex items-center justify-center rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent overflow-hidden via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            <span className="text-gray-500 "> Analyzing resume with AI...</span>
          </div>
        </div>
      ) : !content && !loading ? (
        // NO CONTENT MESSAGE
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p>{noContentMessages[type].message}</p>
          </div>
        </div>
      ) : isImage && !loading ? (
        // IMAGE WITH SKELETON LOADER
        <div className="mt-3 overflow-auto relative rounded-lg ">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-200 animate-pulse relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                <span className="text-gray-500 ">Loading image...</span>
              </div>
            </div>
          )}

          <img
            src={content}
            alt="generated"
            className={`w-full h-full  rounded-lg object-contain transition-opacity duration-500 ${
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
};

export default GeneratedOutputSection;
