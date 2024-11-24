"use client";

import { LucideIcon } from "lucide-react";
import { ShirtIcon } from "lucide-react";
import { UniformType } from "@/lib/uniform-types";

interface UniformIconProps {
  iconName: UniformType["iconName"];
  className?: string;
}

const iconMap: Record<UniformType["iconName"], LucideIcon> = {
  tshirt: ShirtIcon,
  basketball: ShirtIcon,
  afl: ShirtIcon,
  netball: ShirtIcon,
  athletic: ShirtIcon,
  rugby: ShirtIcon,
};

export function UniformIcon({ iconName, className }: UniformIconProps) {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  
  return <Icon className={className} />;
}