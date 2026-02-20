/**
 * Utility to optimize Supabase image URLs
 * Enforces WebP format and allows resizing
 */
export const getOptimizedImageUrl = (
  url: string | undefined | null,
  {
    width,
    height,
    quality = 80,
    format = "webp",
  }: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "origin";
  } = {}
) => {
  if (!url) return "/placeholder.svg";

  // Only apply transformations to Supabase URLs
  if (url.includes("supabase.co/storage/v1/object/public")) {
    const params = new URLSearchParams();
    
    if (width) params.append("width", width.toString());
    if (height) params.append("height", height.toString());
    if (quality) params.append("quality", quality.toString());
    if (format && format !== "origin") params.append("format", format);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  return url;
};
