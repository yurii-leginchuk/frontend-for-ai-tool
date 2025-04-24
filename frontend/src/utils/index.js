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


const validatePrompt = (value) => {
  const trimmed = value.trim();
  if (trimmed.length < 10) {
    return "Prompt must be at least 10 characters long";
  }

  const requiredSubstrings = [
    "article_json",
    "content_json",
    "article_topic",
    "focus",
    "about_client",
    "about_page",
    "copy_tone",
  ];

  for (const substring of requiredSubstrings) {
    const formattedSubstring = `{${substring}}`;
    if (!trimmed.includes(formattedSubstring)) {
      return `Prompt must include "${formattedSubstring}"`;
    }
  }

  return true;
};

const validateKeywords = (value) => {
  console.log(value)
  const keywords = value
    .split(",")
    .map((kw) => kw.trim())
    .filter((kw) => kw.length > 0);
  if (keywords.length === 0) {
    return "At least one keyword is required";
  }
  if (keywords.some((kw) => kw.length > 50)) {
    return "Each keyword must be 50 characters or less";
  }
  return true;
};

const validateDomain = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || "Must be a valid URL";
  } catch (e) {
    return "Must be a valid URL";
  }
};

export {formatDate, cleanHtmlMarkers, validatePrompt, validateKeywords, validateDomain};