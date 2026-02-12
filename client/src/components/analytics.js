// analytics.js
export const pageview = (url) => {
  window.gtag("config", process.env.VITE_GA_ID, {
    page_path: url,
  });
};
