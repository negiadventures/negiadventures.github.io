"use client"

import React, { memo } from "react"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    }

    return (
      // Single render. The upstream component duplicates children into an
      // sr-only span plus an aria-hidden visible span, which makes textContent
      // (and copy-paste) read the word twice. background-clip text is still
      // real text, so screen readers read it correctly without the duplicate.
      <span
        className={`animate-aurora relative inline-block bg-size-[200%_auto] bg-clip-text text-transparent ${className}`}
        style={gradientStyle}
      >
        {children}
      </span>
    )
  }
)

AuroraText.displayName = "AuroraText"
