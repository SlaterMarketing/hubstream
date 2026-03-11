import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showImage?: boolean;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
};

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function BrandLogo({ className, showImage = true, size = "md", inverted = false }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", sizeClasses[size], inverted && "text-white", className)}>
      {showImage && (
        <Image
          src="/logo.png"
          alt=""
          width={size === "sm" ? 24 : size === "md" ? 32 : 40}
          height={size === "sm" ? 24 : size === "md" ? 32 : 40}
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
