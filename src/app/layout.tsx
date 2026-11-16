import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import { appUrl } from "@/lib/utils";
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
  metadataBase: new URL(appUrl()),
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkNest landing page with a phone preview of a creator profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkNest — A home for your entire online presence",
    description:
      "One beautiful, customizable page for every link you share. Build your LinkNest in minutes.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('linknest-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
