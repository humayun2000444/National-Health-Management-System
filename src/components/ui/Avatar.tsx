import { forwardRef, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", fallback, src, alt, ...props }, ref) => {
    const sizes = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
    };

    const initials = fallback
      ? fallback
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

    if (!src) {
      return (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-600 font-medium",
            sizes[size],
            className
          )}
        >
          {initials}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "rounded-full object-cover bg-slate-200",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
