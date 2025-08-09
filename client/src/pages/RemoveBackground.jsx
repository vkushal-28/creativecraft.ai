import { Eraser, Sparkles } from "lucide-react";
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

        <input
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setImageData(e.target.files[0])}
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
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
