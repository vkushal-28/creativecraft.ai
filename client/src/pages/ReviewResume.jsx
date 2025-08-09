import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

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
        title={"AI Review Resume"}
        iconColor={"text-cyan-600"}>
        <p className="mt-4 text-sm font-medium">Upload Resume</p>

        <input
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setInput(e.target.files[0])}
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF format only
        </p>

        <SubmitButton
          btnText="Review Resume"
          loading={loading}
          btnIcon={FileText}
          btnColor="from-blue-500 via-cyan-600 to-teal-500"
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <GeneratedOutputSection
        type="review-resume"
        loading={loading}
        content={content}
      />
    </BaseSection>
  );
};

export default ReviewResume;
