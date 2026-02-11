import React, { memo } from "react";
import { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = memo(({ item }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 mb-4 text-sm bg-white border w-full md:w-1/2 lg:w-1/3 border-gray-200 rounded-lg cursor-pointer shadow-lg">
      <div className="flex justify-between items-center gap-4 ">
        <div>
          <h2>{item.prompt}</h2>
          <div className="text-gray-500 ">
            <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-0 rounded-md mt-2">
              {item.type}
            </button>{" "}
            - {new Date(item.created_at).toLocaleDateString()}
          </div>
        </div>
        {/* <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
          {item.type}
        </button> */}
      </div>
      {expanded && (
        <div>
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full rounded-lg max-w-sm"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700 ">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default CreationItem;
