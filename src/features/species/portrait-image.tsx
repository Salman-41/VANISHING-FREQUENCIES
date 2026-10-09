"use client";

import Image from "next/image";
import { useState } from "react";

export function PortraitImage({ src, alt, width, height, sizes, preload = false }: {
  src: string; alt: string; width: number; height: number; sizes: string; preload?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? <p className="species-photo-error" role="status">Photograph unavailable. {alt}</p>
    : <Image data-species-image src={src} alt={alt} width={width} height={height} sizes={sizes} preload={preload} onError={() => setFailed(true)} />;
}
