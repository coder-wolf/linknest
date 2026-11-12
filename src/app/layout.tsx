import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "LinkNest — A home for your entire online presence",
    template: "%s · LinkNest",
  },
  description:
    "LinkNest gives creators, freelancers and small businesses one beautiful, customizable page for every link they share.",
  openGraph: {
    type: "website",
    siteName: "LinkNest",
    title: "LinkNest — A home for your entire online presence",
    description:
      "One beautiful, customizable page for every link you share. Build your LinkNest in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkNest — A home for your entire online presence",
    description:
      "One beautiful, customizable page for every link you share. Build your LinkNest in minutes.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
