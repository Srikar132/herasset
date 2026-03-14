import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CursorFollower from "@/components/CursorFollower";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
});

export const metadata: Metadata = {
  title: "For Maheswari 🌸",
  description: "A quiet countdown to a day worth celebrating — crafted with love, just for you.",
  keywords: ["birthday", "maheswari", "celebration", "countdown"],
  authors: [{ name: "Made with love" }],
  openGraph: {
    title: "For Maheswari 🌸",
    description: "Something beautiful is coming. Counting every second until your special day.",
    type: "website",
    locale: "en_IN",
  },
  icons: {
    icon: "/dudu-cute.gif",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${cormorant.variable} ${jost.variable} antialiased`}
      >
        {/* <SmoothScrollProvider> */}
          {children}
        {/* </SmoothScrollProvider> */}

        <CursorFollower />
      </body>
    </html>
  );
}
