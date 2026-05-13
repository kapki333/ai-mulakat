const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl && configuredApiUrl.length > 0
    ? configuredApiUrl
    : process.env.NODE_ENV === "production"
      ? "https://ai-mulakat-1.onrender.com"
      : "http://localhost:8000"
).replace(/\/$/, "");
