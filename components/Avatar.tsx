import Image from "next/image";
import iconSrc from "../app/icon.png";

export default function Avatar() {
  // The starburst icon is the avatar per the design bible.
  // app/icon.png doubles as favicon + chat avatar — single source of truth.
  return (
    <div className="tl-avatar" aria-label="ScouseGPT">
      <Image
        src={iconSrc}
        alt="ScouseGPT"
        width={48}
        height={48}
        priority
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
