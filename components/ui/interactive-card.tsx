"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InteractiveCardProps {
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({
  title,
  description,
  className,
  onClick
}: InteractiveCardProps) {
  return (
    <Card
      className={cn(
        "hover-contrast p-6 cursor-pointer select-none",
        "transform transition-all duration-200 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </Card>
  );
}