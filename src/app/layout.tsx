import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/fraunces";
import "./globals.css";

// All pages read from the database at request time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Must Do City", template: "%s · Must Do City" },
  description: "Hand-picked journeys and experiences in cities around the world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
