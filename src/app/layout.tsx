import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoadSense | Training Load Manager",
  description:
    "Track training sessions, calculate workload, and monitor overtraining risk with ACWR analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
