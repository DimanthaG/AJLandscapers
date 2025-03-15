'use client';
import React, { type JSX } from 'react';
import { cn } from "@/lib/utils"

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
}

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <span
      className={cn(
        "animate-text-shimmer bg-gradient-to-r from-[#a3a300] via-[#a3a300]/50 to-[#a3a300] bg-[200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  )
}
