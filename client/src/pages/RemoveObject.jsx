import React, { useState, useCallback, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { ImagePlus, Scissors, X } from "lucide-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";
import api from "../utils/axios";

// Memoize GeneratedOutputSection to avoid unnecessary re-renders
const MemoizedGeneratedOutputSection = React.memo(GeneratedOutputSection);

/* ------------------- File Upload Component ------------------- */
const FileUpload = ({
  imageData,
  dragActive,
  onFile,
  onDelete,
  onDrag,
  onDrop,
}) => {
  const previewUrl = useMemo(
    () => (imageData ? URL.createObjectURL(imageData) : null),
    [imageData]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFileChange = useCallback(
    (e) => {
      if (e.target.files?.[0]) onFile(e.target.files[0]);
    },
    [onFile]
  );

  return (
    <label
      htmlFor="fileUpload"
      className={`flex relative flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-md cursor-pointer transition my-1
        ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-gray-50"
        } 
        hover:border-indigo-400`}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}>
      <input
        id="fileUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        required
      />

      {imageData ? (
        <div>
          <img
            src={previewUrl}
            alt="preview"
            className="h-60 p-2 object-contain"
          />
          {/* Delete Button */}
          <button
            type="button"
            onClick={onDelete}
            className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 hover:bg-indigo-600 transition"
            aria-label="Remove uploaded image">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500 text-sm">
          <ImagePlus className="h-10 w-10 mb-2 text-indigo-400" />
          <p className="text-center">
            Drag & Drop image here <br /> or{" "}
            <span className="text-indigo-500 font-medium">Click to Upload</span>
          </p>
        </div>
      )}
    </label>
  );
};

/* ------------------- Object Input Component ------------------- */
const ObjectInput = ({ object, setObject }) => (
  <>
    <p className="mt-3 text-sm font-medium">Describe object name to remove</p>
    <textarea
      rows={2}
      className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
      placeholder="e.g., watch or spoon (only single object name)"
      onChange={(e) => setObject(e.target.value)}
      value={object}
      required
    />
  </>
);

/* ------------------- Main Component ------------------- */
const RemoveObject = () => {
  const [imageData, setImageData] = useState(null);
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const { getToken } = useAuth();

  /* --- Handlers --- */
  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith("image/")) {
      setImageData(file);
    } else {
      toast.error("Invalid file type. Please upload an image.");
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleDelete = useCallback(() => setImageData(null), []);

  const onSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!imageData) return toast.error("Please upload an image");

      if (object.trim().split(" ").length > 1) {
        return toast.error("Only one object name allowed");
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", imageData);
        formData.append("object", object);

        const { data } = await api.post(
          "api/ai/remove-image-object",
          formData,
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }
        );

        if (data.success) {
          setContent(data.content);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        if (api.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Upload failed");
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [imageData, object, getToken]
  );

  /* --- Render --- */
  return (
    <BaseSection>
      {/* ----- Form Section ----- */}
      <FormSection
        onHandleSubmit={onSubmitHandler}
        title="AI Object Removal"
        iconColor="text-indigo-500">
        <p className="mt-4 text-sm font-medium">Upload Image</p>

        <FileUpload
          imageData={imageData}
          dragActive={dragActive}
          onFile={handleFile}
          onDelete={handleDelete}
          onDrag={handleDrag}
          onDrop={handleDrop}
        />

        <p className="text-xs text-gray-500">
          Supports JPG, PNG, and other image formats
        </p>

        <ObjectInput object={object} setObject={setObject} />

        <SubmitButton
          btnText="Remove Object"
          loading={loading}
          btnIcon={Scissors}
          btnColor="from-indigo-500 via-purple-600 to-pink-500"
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <MemoizedGeneratedOutputSection
        type="remove-object"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default RemoveObject;
