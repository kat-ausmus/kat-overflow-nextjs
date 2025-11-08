import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";

const inter = localFont({
    src: './fonts/InterVR.ttf',
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});


export const metadata: Metadata = {
  title: "Kat Overflow App",
  description: "Stackoverflow like app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
