import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  highlightClassName?: string;
}

export function SectionTitle({
  title,
  highlight,
  subtitle,
  align = "left",
  className,
  titleClassName,
  highlightClassName,
}: SectionTitleProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12 w-full",
        alignmentClasses[align],
        className
      )}
    >
      {subtitle && (
        <span className="text-primary font-medium tracking-wider uppercase text-sm md:text-base">
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-syne leading-tight text-foreground",
          titleClassName
        )}
      >
        {title}
        {highlight && (
          <span
            className={cn(
              "block text-primary font-stardom mt-2",
              highlightClassName
            )}
          >
            {highlight}
          </span>
        )}
      </h2>
    </div>
  );
}
