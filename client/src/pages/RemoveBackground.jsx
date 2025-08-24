import { Eraser, ImagePlus } from "lucide-react";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import BaseSection from "../components/common/BaseSection";
import SubmitButton from "../components/common/Button";
import FormSection from "../components/common/FormSection";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";

// Memoize GeneratedOutputSection to avoid unnecessary re-renders
const MemoizedGeneratedOutputSection = React.memo(GeneratedOutputSection);

const RemoveBackground = () => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const { getToken } = useAuth();
  const controllerRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (file?.type.startsWith("image/")) {
      setImageData(file);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(["dragenter", "dragover"].includes(e.type));
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

  const previewUrl = useMemo(
    () => (imageData ? URL.createObjectURL(imageData) : null),
    [imageData]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!imageData) return;

      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", imageData);

        const { data } = await api.post(
          "api/ai/remove-image-background",
          formData,
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
            signal: controllerRef.current.signal,
          }
        );

        if (data.success) setContent(data.content);
        else toast.error(data.message);
      } catch (error) {
        if (error.name !== "CanceledError") toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [imageData, getToken]
  );
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

        <p className="text-xs text-gray-500 mb-5">
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

      <MemoizedGeneratedOutputSection
        type="remove-background"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default RemoveBackground;
