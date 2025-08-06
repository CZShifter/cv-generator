import React, { forwardRef } from "react";

export interface SectionWrapperProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  marginTop?: number;
  marginBottom?: number;
}

export const SectionWrapper = forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ className, children, style, marginTop, marginBottom }, ref) => {
    // Přidej marginy přímo na wrapper:
    const mergedStyle = {
      ...style,
      ...(marginTop !== undefined ? { marginTop } : {}),
      ...(marginBottom !== undefined ? { marginBottom } : {}),
    };
    return (
      <div ref={ref} className={className} style={mergedStyle}>
        {children}
      </div>
    );
  }
);
SectionWrapper.displayName = "SectionWrapper";
