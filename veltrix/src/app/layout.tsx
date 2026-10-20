import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veltrix.dev"),
  title: "VELTRIX — Intelligence, Engineered.",
  description:
    "Discover VELTRIX, an intelligent coding platform designed to help developers understand code, work across programming languages, and build software.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VELTRIX — Intelligence, Engineered.",
    description:
      "Discover VELTRIX, an intelligent coding platform designed to help developers understand code, work across programming languages, and build software.",
    url: "https://veltrix.dev",
    siteName: "VELTRIX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VELTRIX — Intelligence, Engineered.",
    description:
      "Discover VELTRIX, an intelligent coding platform designed to help developers understand code, work across programming languages, and build software.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
