// analytics.js
export const pageview = (url) => {
  console.log(import.meta.env.VITE_GA_ID);
  window.gtag("config", import.meta.env.VITE_GA_ID, {
    page_path: url,
  });
};
