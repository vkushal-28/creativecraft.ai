import { Eraser, ImagePlus, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";
import SubmitButton from "../components/common/Button";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageData(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = () => {
    setImageData(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", imageData);

      const { data } = await axios.post(
        "api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <BaseSection>
      {/* ----- Form Section ----- */}
      <FormSection
        onHandleSubmit={onSubmitHandler}
        title={"Remove Background"}
        iconColor={"text-red-500"}>
        <p className="mt-4 text-sm font-medium">Upload Image</p>

        <label
          htmlFor="fileUpload"
          className={`flex relative flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-md cursor-pointer transition my-1
          ${
            dragActive
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          } 
          hover:border-red-400`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            required
          />
          {imageData ? (
            <div className="">
              <img
                src={URL.createObjectURL(imageData)}
                alt="preview"
                className="h-60 object-contain"
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500 text-sm">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mb-2 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 014-4h1V7a4 4 0 118 0v4h1a4 4 0 014 4v4H3v-4z"
                />
              </svg> */}

              <ImagePlus className="h-10 w-10 mb-2 text-red-400 text-center font-light" />
              <p className="text-center">
                Drag & Drop image here <br /> or{" "}
                <span className="text-red-500 font-medium">
                  Click to Upload
                </span>
              </p>
            </div>
          )}
        </label>

        <p className="text-xs text-gray-500 ">
          Supports JPG, PNG, and other image formats
        </p>
        <SubmitButton
          btnText="Remove Background"
          loading={loading}
          btnIcon={Eraser}
          btnColor={"from-yellow-400 via-red-500 to-pink-500"}
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <GeneratedOutputSection
        type="remove-background"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default RemoveBackground;
