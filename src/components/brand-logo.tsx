import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showImage?: boolean;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  /** When set, shows org logo instead of HubStream branding. Use for event pages. */
  customLogoUrl?: string | null;
};

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

const sizePx = { sm: 24, md: 32, lg: 40 };

export function BrandLogo({ className, showImage = true, size = "md", inverted = false, customLogoUrl }: Props) {
  const px = sizePx[size];

  if (customLogoUrl && showImage) {
    return (
      <span className={cn("inline-flex items-center gap-2 font-semibold", sizeClasses[size], inverted && "text-white", className)}>
        <img
          src={customLogoUrl}
          alt=""
          width={px}
          height={px}
          className={cn("shrink-0 object-contain", inverted && "brightness-0 invert")}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", sizeClasses[size], inverted && "text-white", className)}>
      {showImage && (
        <Image
          src="/logo.png"
          alt=""
          width={px}
          height={px}
          className={cn("shrink-0", inverted && "brightness-0 invert")}
        />
      )}
      <span>
        <span style={inverted ? { color: "inherit" } : { color: "#ff724c" }}>Hub</span>
        <span className={inverted ? "text-inherit" : "text-foreground"}>Stream</span>
      </span>
    </span>
  );
}
