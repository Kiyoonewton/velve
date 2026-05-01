import type { Metadata } from "next";
import { Pacifico, Abril_Fatface, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layouts/Navbar";
import "./globals.css";

// Logo + all display / heading text
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
});

// Nav links + section headings (bold serif — matches "Home Catalog Contact" in reference)
const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

// Body / UI text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: { default: "Velve' Bags", template: "%s | Velve' Bags" },
  description: "Velve' Bags — handcrafted beaded bags and accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${pacifico.variable} ${abrilFatface.variable} ${dmSans.variable}`}>
      <body className="font-script">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
