import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";
import SubmitButton from "../components/common/Button";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli Style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "api/ai/generate-image",
        {
          prompt,
          publish,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
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
          {imageStyle.map((style, index) => (
            <span
              className={`text-xs px-3 py-1 border rounded-full cursor-pointer ${
                selectedStyle === style
                  ? "bg-green-50 text-teal-600"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
              onClick={() => setSelectedStyle(style)}>
              {style}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <label className="relative cursor-pointer ">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-teal-600 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm"> Make this image public</p>
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
      <GeneratedOutputSection
        type="generate-image"
        loading={loading}
        content={content}
        isImage={true}
      />
    </BaseSection>
  );
};

export default GenerateImages;
