import { useState } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  className,
  loading,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  // Determine loading strategy
  const loadingStrategy = priority ? "eager" : (loading || "lazy");
  
  // Get optimized URL for Supabase
  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality });

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loadingStrategy}
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        {...(priority ? { fetchpriority: "high" } : {})}
        {...props}
      />
    </div>
  );
};
