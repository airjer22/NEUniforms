"use client";

import Image from "next/image";
import { UniformType } from "@/lib/uniform-types";

interface UniformIconProps {
  iconName: UniformType["iconName"];
  className?: string;
}

const iconMap: Record<UniformType["iconName"], string> = {
  tshirt: "/uniforms/circle-neck-tshirt.png",
  basketball: "/uniforms/basketball-singlet.png",
  afl: "/uniforms/afl-singlet.png",
  netball: "/uniforms/netball-dress.png",
  athletic: "/uniforms/athletic-singlet.png",
  rugby: "/uniforms/rugby-jersey.png",
};

export function UniformIcon({ iconName, className }: UniformIconProps) {
  const imagePath = iconMap[iconName];
  if (!imagePath) return null;
  
  return (
    <div className={`relative w-12 h-12 ${className}`}>
      <Image
        src={imagePath}
        alt={`${iconName} uniform`}
        fill
        className="object-contain"
      />
    </div>
  );
}