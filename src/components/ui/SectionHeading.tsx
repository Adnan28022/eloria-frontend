import React from "react";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  heading,
  align = "center",
  className = "",
}) => {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {label && (
        <span className="block text-xs uppercase tracking-[0.25em] text-terracotta mb-3 font-semibold">
          {label}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal tracking-wide font-normal">
        {heading}
      </h2>
    </div>
  );
};