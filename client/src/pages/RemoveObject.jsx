import { ImagePlus, Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [imageData, setImageData] = useState(null);
  const [object, setObject] = useState("");
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

      if (object.split(" ").length > 1) {
        return toast("Please enter only one object name");
      }

      const formData = new FormData();
      formData.append("image", imageData);
      formData.append("object", object);

      const { data } = await axios.post(
        "api/ai/remove-image-object",
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
        title={"AI Object Removal"}
        iconColor={"text-indigo-500"}>
        <p className="mt-4 text-sm font-medium">Upload Image</p>

        <label
          htmlFor="fileUpload"
          className={`flex relative flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-md cursor-pointer transition my-1
          ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-gray-50"
          } 
          hover:border-indigo-400`}
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
                className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 hover:bg-indigo-500 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500 text-sm">
              <ImagePlus className="h-10 w-10 mb-2 text-indigo-400 text-center font-light" />
              <p className="text-center">
                Drag & Drop image here <br /> or{" "}
                <span className="text-indigo-500 font-medium">
                  Click to Upload
                </span>
              </p>
            </div>
          )}
        </label>

        <p className="text-xs text-gray-500 ">
          Supports JPG, PNG, and other image formats
        </p>
        <p className="mt-3 text-sm font-medium">
          Describe object name to remove
        </p>
        <textarea
          rows={2}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, only singe object name,"
          onChange={(e) => setObject(e.target.value)}
          value={object}
          required
        />

        <SubmitButton
          btnText="Remove Object"
          loading={loading}
          btnIcon={Scissors}
          btnColor={"from-indigo-500 via-purple-600 to-pink-500"}
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <GeneratedOutputSection
        type="remove-object"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default RemoveObject;
