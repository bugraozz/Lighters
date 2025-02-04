"use client"

import React from 'react'
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className, ...props }) => (
  <div className={cn("border-t border-gray-300 my-4", className)} {...props} />
)

export { Separator }
