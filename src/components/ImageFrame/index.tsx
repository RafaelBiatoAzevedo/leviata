import type { ImgHTMLAttributes } from "react";
import { Frame, Mat, Ornament, Picture } from "./styles";

interface ImageFrameProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "children"
> {
  src: string;
  alt: string;
  maxWidth?: string;
  maxHeight?: string;
}

export function ImageFrame({
  src,
  alt,
  className,
  maxWidth = "900px",
  maxHeight = "600px",
  loading = "lazy",
  decoding = "async",
  ...imageProps
}: ImageFrameProps) {
  return (
    <Frame className={className} $maxWidth={maxWidth}>
      <Ornament aria-hidden="true" $position="top">
        ❧
      </Ornament>
      <Mat>
        <Picture
          {...imageProps}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          $maxHeight={maxHeight}
        />
      </Mat>
      <Ornament aria-hidden="true" $position="bottom">
        ❧
      </Ornament>
    </Frame>
  );
}
