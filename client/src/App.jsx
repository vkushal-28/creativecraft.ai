import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import Dashboard from "./pages/Dashboard";
import GenerateImages from "./pages/GenerateImages";
import RemoveObject from "./pages/RemoveObject";
import RemoveBackground from "./pages/RemoveBackground";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import { Toaster } from "react-hot-toast";
import { pageview } from "./components/analytics";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return (
    <main>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
