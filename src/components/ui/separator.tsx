"use client"

import React from 'react'
import { cn } from "@/lib/utils"

const Separator = ({ className, ...props }) => (
  <div className={cn("border-t border-gray-300 my-4", className)} {...props} />
)

export { Separator }
