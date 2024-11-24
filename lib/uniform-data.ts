import { ShirtIcon, Shirt2Icon, GraduationCapIcon, TieIcon } from "lucide-react";

export const uniformTypes = [
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

export const uniformSizes = [
  { value: "xs", label: "Extra Small (XS)" },
  { value: "s", label: "Small (S)" },
  { value: "m", label: "Medium (M)" },
  { value: "l", label: "Large (L)" },
  { value: "xl", label: "Extra Large (XL)" },
  { value: "2xl", label: "Double XL (2XL)" },
];