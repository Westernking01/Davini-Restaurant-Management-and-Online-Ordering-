import type { Metadata } from "next";
import "./globals.css";
import { AppWrapper } from "@/components/app-wrapper";

export const metadata: Metadata = {
  title: "Davini's Food Bank | Authentic & Warm Culinary Experiences",
  description: "Experience premium dining, seamless online orders, and table reservations at Davini's Food Bank.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo-compact.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-amber-200 selection:text-amber-900 animate-fade-in">
        <AppWrapper>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AppWrapper>
      </body>
    </html>
  );
}
