const contactDetails = [
  { id: "email", value: "customercare@business365day.com", href: "mailto:customercare@business365day.com", icon: "mail" },
  { id: "phone", value: "+229 50585332", href: "tel:+22950585332", icon: "phone" },
  { id: "studio", href: null, icon: "map" }
];

const serviceOptionValues = [
  "Software / website",
  "AI and automation",
  "Cybersecurity / cloud",
  "Mobile application",
  "Smart home automation",
  "AI camera surveillance",
  "Fingerprint / face detection access",
  "Digital consulting",
  "Other"
];

const budgetOptionValues = [
  "Select a budget",
  "Under $500",
  "$500-$2,000",
  "$2,000-$5,000",
  "$5,000-$10,000",
  "$10,000+",
  "To be discussed"
];

const contactButtons = { whatsappHref: "https://wa.me/message/CHA4ZH7OIYDSP1" };

export { budgetOptionValues, contactButtons, contactDetails, serviceOptionValues };
