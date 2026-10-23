import { useState } from "react";
import { cx } from "../../lib/utils";
import RansomText from "./RansomText";

export default function XeroxImage({ src, alt, className = "", onFail }: { src?: string; alt: string; className?: string; onFail?: () => void }) {
  const [failed, setFailed] = useState<string>();

  if (!src || failed === src) {
    const initials = alt.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    return (
      <div className={cx("halftone grid place-items-center bg-soot", className)} role="img" aria-label={alt}>
        <RansomText text={initials || "?"} size="text-4xl" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        setFailed(src);
        onFail?.();
      }}
      className={cx("object-cover xerox", className)}
    />
  );
}
