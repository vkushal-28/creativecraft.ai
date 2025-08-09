import { Edit } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 1000, text: "800-1000" },
    { length: 1500, text: "1200-1500" },
    { length: 2000, text: "1500+" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;

      const { data } = await axios.post(
        "api/ai/generate-article",
        {
          prompt,
          length: selectedLength.length,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <BaseSection>
      {/* ----- Form Section ----- */}
      <FormSection
        onHandleSubmit={onSubmitHandler}
        title={"AI Article Generation"}
        iconColor={"text-indigo-600"}>
        <p className="mt-4 text-sm font-medium">Article Topic</p>
        <textarea
          rows="3"
          type="text"
          className="w-full p-2 px-3 mt-1 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artifiaial intelligence is..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          required
        />
        <p className="mt-3 text-sm font-medium">Article Length (in words)</p>
        <div className="mt-2 flex gap-2 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              className={`text-xs px-3 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-indigo-600"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
              onClick={() => setSelectedLength(item)}>
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <SubmitButton
          btnText=" Generate Article"
          loading={loading}
          btnIcon={Edit}
          btnColor={"from-cyan-700 via-blue-500 to-indigo-600"}
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <GeneratedOutputSection
        type="generate-article"
        loading={loading}
        content={content}
      />
    </BaseSection>
  );
};

export default WriteArticle;
