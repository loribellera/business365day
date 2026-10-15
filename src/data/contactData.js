const contactDetails = [
  { id: "email", value: "business365admins@gmail.com", href: "mailto:business365admins@gmail.com", icon: "mail" },
  { id: "phone", value: "+234 800 355 0365", href: "tel:+2348003550365", icon: "phone" },
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

const contactButtons = { whatsappHref: "https://wa.me/2348003550365" };

export { budgetOptionValues, contactButtons, contactDetails, serviceOptionValues };
