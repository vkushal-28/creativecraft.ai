import { FileText, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Only PDF files are supported");
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
    setResumeFile(null);
  };

  const onSubmitHandler = async (e) => {
    console.log("first");
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);

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

        <label
          htmlFor="resumeUpload"
          className={`relative flex flex-col items-center justify-center w-full h-60 border-2 border-dashed rounded-md cursor-pointer transition my-1
            ${
              dragActive
                ? "border-cyan-600 bg-cyan-50"
                : "border-gray-300 bg-gray-50"
            } 
            hover:border-cyan-500`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}>
          <input
            id="resumeUpload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {resumeFile ? (
            <div className="relative flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow">
              <FileText className="w-6 h-6 text-cyan-600" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {resumeFile.name}
              </span>
              <button
                type="button"
                onClick={handleDelete}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500 text-sm text-center">
              <FileText className="h-10 w-10 mb-2 text-cyan-600" />
              <p>
                Drag & Drop your resume here <br /> or{" "}
                <span className="text-cyan-600 font-medium">
                  Click to Upload
                </span>
              </p>
              {/* <p className="text-xs text-gray-400 mt-1">PDF format only</p> */}
            </div>
          )}
        </label>

        {/* <resumeFile
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setResumeFile(e.target.files[0])}
          required
        /> */}
        <p className="text-xs text-gray-500 mt-1">Supports PDF format only</p>

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
