import {
  BrainCircuit,
  Check,
  CodeXml,
  Globe,
  House,
  ArrowUpRight,
  ShieldCheck,
  HouseWifi
} from "lucide-react";

const servicesData = [
  { icon: CodeXml, delay: null },
  { icon: Globe, delay: "100" },
  { icon: BrainCircuit, delay: "200" },
  { icon: HouseWifi, delay: null },
  { icon: ShieldCheck, delay: "100" },
  { icon: House, delay: "200" }
];

const smartBanner = { icon: ArrowUpRight };

export { Check, smartBanner };
export default servicesData;
