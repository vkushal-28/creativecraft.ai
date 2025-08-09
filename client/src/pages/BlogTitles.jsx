import { useAuth } from "@clerk/clerk-react";
import { Hash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Travel",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}.`;

      const { data } = await axios.post(
        "api/ai/generate-blog-title",
        {
          prompt,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
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
        title={"AI Title Generation"}
        iconColor={"text-purple-600"}>
        <p className="mt-4 text-sm font-medium">Keyword</p>
        <textarea
          rows={"3"}
          type="text"
          className="w-full p-2 px-3 mt-1 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artifiaial intelligence is..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          required
        />
        <p className="mt-3 text-sm font-medium">Category</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          {blogCategories.map((item, index) => (
            <span
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
              key={index}
              onClick={() => setSelectedCategory(item)}>
              {item}
            </span>
          ))}
        </div>
        <br />

        <SubmitButton
          btnText=" Generate Article"
          loading={loading}
          btnIcon={Hash}
          btnColor="from-fuchsia-500 via-purple-600 to-pink-600"
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <GeneratedOutputSection
        type="blog-title"
        loading={loading}
        content={content}
      />
    </BaseSection>
  );
};

export default BlogTitles;
