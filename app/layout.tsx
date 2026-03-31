import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Paper from "@/components/paper";
import { navItems } from "@/constants/nav";
import { getAllPageSettings } from "@/lib/page-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mihir Patel",
    template: "%s - Mihir Patel",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageSettings = await getAllPageSettings();
  const visibleNavItems = navItems.filter((item) => {
    const slug = item.link.replace(/^\//, "");
    const setting = pageSettings.find((s) => s.slug === slug);
    return setting ? setting.enabled : true;
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const savedTheme = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const theme = savedTheme === "dark" || savedTheme === "light"
                ? savedTheme
                : prefersDark
                  ? "dark"
                  : "light";

              document.documentElement.classList.toggle("dark", theme === "dark");
              document.documentElement.style.colorScheme = theme;
            } catch (_) {}
          })();`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Paper>
          <Nav items={visibleNavItems} />
          {children}
          <Footer />
        </Paper>
      </body>
    </html>
  );
}
