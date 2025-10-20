import { useState } from "react";

const FALLBACK = "https://placehold.co/600x400?text=Producto";

export default function ImageWithFallback({ src, alt, className, style }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setImgSrc(FALLBACK)}
    />
  );
}
