const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(",", "");
};


const cleanHtmlMarkers = (htmlString) => {
  if (typeof htmlString !== "string") return htmlString || "";

  return htmlString
    .replace(/^```html\s*\n?/, "")
    .replace(/\s*```\s*$/, "");
};

export {formatDate, cleanHtmlMarkers};