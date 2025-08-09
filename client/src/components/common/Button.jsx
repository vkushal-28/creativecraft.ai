import React from "react";

const SubmitButton = ({
  btnText,
  loading,
  btnIcon,
  fromColor,
  toColor,
  btnColor,
}) => {
  console.log(fromColor, toColor);
  const Icon = btnIcon;
  return (
    <button
      className={`flex w-full justify-center items-center gap-2 bg-gradient-to-r ${btnColor} text-white px-4 text-sm py-2 lg:mt-4 mt-0 rounded-lg cursor-pointer `}
      disabled={loading}>
      {loading ? (
        <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
      ) : (
        <Icon className="w-5" />
      )}
      {btnText}
    </button>
  );
};

export default SubmitButton;
