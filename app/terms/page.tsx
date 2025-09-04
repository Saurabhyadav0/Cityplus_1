import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CityPlus - Terms & Conditions",
  description:
    "Read the official Terms & Conditions of CityPlus. Learn about your rights, responsibilities, privacy, and rules for reporting and tracking civic issues through our platform.",
  keywords: [
    "CityPlus",
    "Terms and Conditions",
    "Privacy Policy",
    "Civic Issues",
    "Community Reporting",
    "Smart City App",
    "Citizen Engagement",
  ],
  authors: [{ name: "CityPlus Team", url: "https://cityplus.me" }],
  creator: "CityPlus",
  publisher: "CityPlus",
  robots: "index, follow", // allow search engines

  // Open Graph (for Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "CityPlus - Terms & Conditions",
    description:
      "Understand the terms of using CityPlus for reporting civic issues, tracking complaints, and improving your community.",
    url: "https://cityplus.me/terms",
    siteName: "CityPlus",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://cityplus.me/og-image.png", // replace with your image
        width: 1200,
        height: 630,
        alt: "CityPlus - Building Better Communities",
      },
    ],
  },

  // Twitter Card (for Twitter/X)
  twitter: {
    card: "summary_large_image",
    title: "CityPlus - Terms & Conditions",
    description:
      "Read the rules and policies of CityPlus to ensure safe and transparent civic issue reporting.",
    images: ["https://cityplus.me/og-image.png"], // replace with your image
    creator: "@cityplus",
  },

  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Additional meta
  category: "Civic Tech",
  applicationName: "CityPlus",
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-muted-foreground leading-relaxed">
        Here goes your detailed terms and conditions content...
      </p>
    </div>
  )
}
