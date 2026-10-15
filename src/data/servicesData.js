import {
  BrainCircuit,
  Check,
  CodeXml,
  Globe,
  House,
  ArrowUpRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";

const servicesData = [
  { icon: CodeXml, delay: null },
  { icon: Globe, delay: "100" },
  { icon: BrainCircuit, delay: "200" },
  { icon: Smartphone, delay: null },
  { icon: ShieldCheck, delay: "100" },
  { icon: House, delay: "200" }
];

const smartBanner = { icon: ArrowUpRight };

export { Check, smartBanner };
export default servicesData;
