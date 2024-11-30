export type UniformType = {
  id: string;
  name: string;
  iconName: "tshirt" | "basketball" | "afl" | "netball" | "athletic" | "rugby";
};

export type Sport = {
  value: string;
  label: string;
};

export type Gender = {
  value: string;
  label: string;
};

export const uniformTypes: UniformType[] = [
  {
    id: "tshirt",
    name: "T-Shirt",
    iconName: "tshirt",
  },
  {
    id: "basketball",
    name: "Basketball Singlet",
    iconName: "basketball",
  },
  {
    id: "afl",
    name: "AFL Singlet",
    iconName: "afl",
  },
  {
    id: "netball",
    name: "Netball Dress",
    iconName: "netball",
  },
  {
    id: "athletic",
    name: "Athletic Singlet",
    iconName: "athletic",
  },
  {
    id: "rugby",
    name: "Rugby Jersey",
    iconName: "rugby",
  },
];

export const sports: Sport[] = [
  { value: "afl", label: "AFL" },
  { value: "baseball", label: "Baseball" },
  { value: "basketball", label: "Basketball" },
  { value: "cricket", label: "Cricket" },
  { value: "crosscountry", label: "Cross Country" },
  { value: "golf", label: "Golf" },
  { value: "hockey", label: "Hockey" },
  { value: "netball", label: "Netball" },
  { value: "rugbyleague", label: "Rugby League" },
  { value: "rugbyunion", label: "Rugby Union" },
  { value: "soccer", label: "Soccer" },
  { value: "softball", label: "Softball" },
  { value: "squash", label: "Squash" },
  { value: "trackfield", label: "Track & Field" },
  { value: "tennis", label: "Tennis" },
  { value: "touchfootball", label: "Touch Football" },
  { value: "volleyball", label: "Volleyball" },
];

export const genders: Gender[] = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "both", label: "Both" },
];