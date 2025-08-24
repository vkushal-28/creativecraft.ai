import { Sparkle } from "lucide-react";
import React from "react";

const FormSection = React.memo(
  ({ onHandleSubmit, title, iconColor, children }) => {
    return (
      <form
        className="w-2/3 max-xl:w-full p-4 bg-white rounded-lg border border-gray-200 shadow-lg"
        onSubmit={onHandleSubmit}>
        <div className="flex items-center gap-3 ">
          <Sparkle className={`w-6 ${iconColor}`} />
          <h1 className="text-xl font-semibold text-slate-700">{title}</h1>
        </div>
        {children}
      </form>
    );
  }
);

export default FormSection;
