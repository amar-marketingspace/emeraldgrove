// Edit this file when spinning up the template for a new venue.
// Nothing in components.js or main.js should need to change.
window.SITE_CONFIG = {
  brandName: "Emerald Grove Events & Spaces",
  tagline: "Rent the space. Make it yours.",
  seoTagline: "Flexible Event & Celebration Spaces in Bangalore",
  location: "JP Nagar, Bangalore",

  nav: [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Gallery", href: "gallery.html" },
    { label: "Contact", href: "contact.html" }
  ],
  ctaLabel: "Enquire now",
  ctaHref: "contact.html",

  contact: {
    phone: "+91 91876 61638",
    whatsapp: "https://wa.me/919187661638",
    email: "info@emeraldgrove.co.in",
    address: "No. 73, 2nd Cross, KR Layout, JP Nagar 6th Phase, Bangalore 560078",
    responseTime: "We usually reply within a few hours",
    // Placeholder pin (nearby JP Nagar 7th Phase landmark) – swap for the real
    // venue's coordinates once available. Note this does NOT yet match the
    // address text above (6th Phase vs 7th Phase) – deliberate stand-in for now.
    mapsEmbedSrc: "https://maps.google.com/maps?q=12.8789511,77.5879323&z=15&output=embed",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=12.8789511,77.5879323"
  },

  social: {
    instagram: "https://instagram.com/emeraldgrove.blr",
    youtube: "#",     // placeholder – add channel URL
    facebook: "#"     // placeholder
  },

  // Apps Script Web App URL – fill in once the script is deployed (Phase 1b)
  formEndpoint: "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE",

  footerNote: "Policies are in draft and pending final legal review."
};
