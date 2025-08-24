import { useAuth } from "@clerk/clerk-react";
import { Hash } from "lucide-react";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import GeneratedOutputSection from "../components/common/GeneratedOutputSection";
import SubmitButton from "../components/common/Button";
import BaseSection from "../components/common/BaseSection";
import FormSection from "../components/common/FormSection";
import api from "../utils/axios";

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

// Memoize GeneratedOutputSection to avoid unnecessary re-renders
const MemoizedGeneratedOutputSection = React.memo(GeneratedOutputSection);

const CategorySelector = ({ categories, selected, onSelect }) => (
  <div className="mt-2 flex gap-2 flex-wrap">
    {categories.map((item) => (
      <span
        key={item}
        className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
          selected === item
            ? "bg-purple-50 text-purple-700"
            : "text-gray-500 border-gray-300"
        }`}
        onClick={() => onSelect(item)}>
        {item}
      </span>
    ))}
  </div>
);

const BlogTitles = () => {
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleCategoryClick = useCallback((item) => {
    setSelectedCategory(item);
  }, []);

  const onSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}.`;

        const { data } = await api.post(
          "api/ai/generate-blog-title",
          { prompt },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        data.success ? setContent(data.content) : toast.error(data.message);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
    [input, selectedCategory, getToken]
  );

  return (
    <BaseSection>
      {/* ----- Form Section ----- */}
      <FormSection
        onHandleSubmit={onSubmitHandler}
        title="AI Title Generation"
        iconColor="text-purple-600">
        <p className="mt-4 text-sm font-medium">Keyword</p>
        <textarea
          rows={3}
          className="w-full p-2 px-3 mt-1 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          required
        />

        <p className="mt-3 text-sm font-medium">Category</p>
        <CategorySelector
          categories={blogCategories}
          selected={selectedCategory}
          onSelect={handleCategoryClick}
        />

        <br />

        <SubmitButton
          btnText="Generate Article"
          loading={loading}
          btnIcon={Hash}
          btnColor="from-fuchsia-500 via-purple-600 to-pink-600"
          disabled={!input.trim() || loading}
        />
      </FormSection>

      {/* ----- Result Section ----- */}
      <MemoizedGeneratedOutputSection
        type="blog-title"
        loading={loading}
        content={content}
      />
    </BaseSection>
  );
};

export default BlogTitles;
