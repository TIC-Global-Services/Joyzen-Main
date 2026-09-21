import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/reuseable/SmoothScroller";
import WaveGridBackground from "@/reuseable/wave-grid-background";
import { epilogue, satoshi } from "@/fonts/font";
import Navbar from "@/reuseable/Navbar";
import Footer from "@/reuseable/Footer";
import Preloader from "@/reuseable/loader";



const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://joyzen.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Joyzen | Care The Way Life Actually Happens",
    template: "%s | Joyzen",
  },
  description:
    "Joyzen connects your care, your health information, guidance, and doctor support into one unified experience. Built for life. Designed for longevity.",
  keywords: [
    "Joyzen",
    "Joyzen Healthcare",
    "Patient Care",
    "Longevity Medicine",
    "Preventive Healthcare",
    "Telehealth India",
    "Doctor Consultation",
    "Luna AI Health",
    "E-Pharmacy",
    "International Healthcare",
    "Personalized Medicine",
  ],
  authors: [{ name: "Joyzen Team", url: siteUrl }],
  creator: "Joyzen",
  publisher: "Joyzen",
  applicationName: "Joyzen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Joyzen | Care The Way Life Actually Happens",
    description:
      "Joyzen connects your care, your health information, guidance, and doctor support into one unified experience.",
    url: siteUrl,
    siteName: "Joyzen",
    images: [
      {
        url: "/joyzen_logo.png",
        width: 1200,
        height: 630,
        alt: "Joyzen - Healthcare Built for Life",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joyzen | Care The Way Life Actually Happens",
    description:
      "Joyzen connects your care, your health information, guidance, and doctor support into one unified experience.",
    images: ["/joyzen_logo.png"],
    creator: "@joyzen_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/joyzen-logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Joyzen",
      url: siteUrl,
      logo: `${siteUrl}/joyzen_logo.png`,
      description: "Joyzen brings your care, medical history, clinical guidance, and doctor support into one connected healthcare ecosystem.",
      email: "info@joyzen.in",
      telephone: "+91-124-4962743",
      sameAs: [
        "https://www.instagram.com/joyzen.in",
      ],
      medicalSpecialty: [
        "PrimaryCare",
        "PreventiveMedicine",
        "PublicHealth",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Joyzen",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${epilogue.variable} font-sans h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative bg-white text-foreground font-sans">
        <Preloader />
        {/* Full-site 3D Honeycomb background with localized #EF8F60 border glow */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
          <WaveGridBackground colorBase="#f2f1f0" colorHigh="#EF8F60" autoAnimate={false} waveAmplitude={0.5} waveMaxHeight={0.5} />
        </div>
        <SmoothScroller>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
