import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  showImage?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function BrandLogo({ className, showImage = true, size = "md" }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", sizeClasses[size], className)}>
      {showImage && (
        <Image
          src="/logo.png"
          alt=""
          width={size === "sm" ? 24 : size === "md" ? 32 : 40}
          height={size === "sm" ? 24 : size === "md" ? 32 : 40}
          className="shrink-0"
        />
      )}
      <span>
        <span style={{ color: "#ff724c" }}>Hub</span>
        <span className="text-foreground">Stream</span>
      </span>
    </span>
  );
}
