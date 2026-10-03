import type { Metadata } from "next";

import "./globals.css";

import AppShell from "@/src/layout/AppShell";
import { ThemeProvider } from "@/src/layout/ThemeContext";

export const metadata: Metadata = {
  title: "Productivity AI",
  description: "Personal productivity platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}