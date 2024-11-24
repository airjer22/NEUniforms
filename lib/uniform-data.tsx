import { ReactNode } from "react";
import { ShirtIcon, Shirt2Icon, GraduationCapIcon, TieIcon } from "lucide-react";

interface UniformType {
  id: string;
  name: string;
  icon: ReactNode;
}

export const uniformTypes: UniformType[] = [
  {
    id: "shirt",
    name: "School Shirt",
    icon: <ShirtIcon className="h-6 w-6" />,
  },
  {
    id: "pants",
    name: "School Pants",
    icon: <Shirt2Icon className="h-6 w-6" />,
  },
  {
    id: "tie",
    name: "School Tie",
    icon: <TieIcon className="h-6 w-6" />,
  },
  {
    id: "graduation",
    name: "Graduation Gown",
    icon: <GraduationCapIcon className="h-6 w-6" />,
  },
];

interface UniformSize {
  value: string;
  label: string;
}

export const uniformSizes: UniformSize[] = [
  { value: "xs", label: "Extra Small (XS)" },
  { value: "s", label: "Small (S)" },
  { value: "m", label: "Medium (M)" },
  { value: "l", label: "Large (L)" },
  { value: "xl", label: "Extra Large (XL)" },
  { value: "2xl", label: "Double XL (2XL)" },
];