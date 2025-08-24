import { Image } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";
import SubmitButton from "../components/common/Button";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const imageStyles = [
  "Realistic",
  "Ghibli Style",
  "Anime Style",
  "Cartoon Style",
  "Fantasy Style",
  "3D Style",
  "Portrait Style",
];

// Memoize GeneratedOutputSection to avoid unnecessary re-renders
const MemoizedGeneratedOutputSection = React.memo(GeneratedOutputSection);

const GenerateImages = () => {
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  // Memoize submit handler
  const onSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
        const token = await getToken();

        const { data } = await axios.post(
          "api/ai/generate-image",
          { prompt, publish },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setContent(data.content);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [getToken, input, selectedStyle, publish]
  );

  // Memoize style buttons
  const renderedStyleButtons = useMemo(() => {
    return imageStyles.map((style) => (
      <span
        key={style}
        className={`text-xs px-3 py-1 border rounded-full cursor-pointer ${
          selectedStyle === style
            ? "bg-green-50 text-teal-600"
            : "text-gray-500 border-gray-300"
        }`}
        onClick={() => setSelectedStyle(style)}>
        {style}
      </span>
    ));
  }, [selectedStyle]);

  return (
    <BaseSection>
      {/* ----- Form Section ----- */}
      <FormSection
        onHandleSubmit={onSubmitHandler}
        title={"AI Image Generator"}
        iconColor={"text-teal-600"}>
        <p className="mt-4 text-sm font-medium">Keyword</p>
        <textarea
          rows={3}
          className="w-full p-2 px-3 mt-1 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in the image..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          required
        />

        <p className="mt-3 text-sm font-medium">Style</p>
        <div className="mt-2 flex gap-2 flex-wrap sm:max-w-9/11">
          {renderedStyleButtons}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-teal-600 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image public</p>
        </div>
        <br />

        <SubmitButton
          btnText="Generate Image"
          loading={loading}
          btnIcon={Image}
          btnColor={
            "bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(239,_78,_123),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155))]"
          }
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <MemoizedGeneratedOutputSection
        type="generate-image"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default GenerateImages;
