import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Converso",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body
        className={`${bricolage.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider appearance={{ variables: { colorPrimary: "#fe5933" } }}>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
