import { Edit } from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/article-search.json";
import { noContentMessages } from "../../assets/assets";

const GeneratedOutputSection = ({ type, loading, isImage, content }) => {
  const Icon = noContentMessages[type].Icon;

  return (
    <div
      className={`w-full max-h-[calc(100vh-5.5rem)] shadow-lg  p-4 bg-white rounded-lg flex flex-col border border-gray-200  ${
        !content ? "h-[600px]" : "h-full"
      }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 text-${noContentMessages[type].color}`} />
        <h1 className="text-xl font-semibold capitalize">
          {noContentMessages[type].name}
        </h1>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center ">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: "250px" }}
          />
          {/* <span className="">processing...</span> */}
        </div>
      ) : !content && !loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9" />
            <p> {noContentMessages[type].message} </p>
          </div>
        </div>
      ) : isImage && !loading ? (
        <div className="mt-3 h-full">
          <img src={content} alt="image" className="w-full h-full" />
        </div>
      ) : (
        <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
          <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedOutputSection;
