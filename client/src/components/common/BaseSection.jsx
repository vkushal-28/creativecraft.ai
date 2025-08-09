import React from "react";

const BaseSection = ({ children }) => {
  return (
    <div className="h-auto w-full overflow-y-scroll p-4 flex items-start max-xl:flex-wrap gap-4 text-slate-700">
      {...children}
    </div>
  );
};

export default BaseSection;
