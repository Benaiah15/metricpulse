import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MetricPulse | Server Health",
  description: "Enterprise system monitoring and logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required by next-themes so the screen doesn't flicker on reload
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 antialiased min-h-screen transition-colors duration-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Next.js will automatically inject either the (dashboard)/layout.tsx or the login page here */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}