import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";
import {ThemeProvider} from "next-themes";

const inter = localFont({
    src: './fonts/InterVR.ttf',
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});


export const metadata: Metadata = {
  title: "Kat Overflow App",
  description: "Stackoverflow like app built with Next.js",
    icons: {
      icon: "/favicon.ico",
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
