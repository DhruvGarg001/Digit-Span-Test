import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digit Span Test - By Dhruv Garg",
  description: "An online psychology experiment for measuring digit span memory capacity. Built as part of the Honors Option for PSY 200 at Michigan State University.",
  authors: [{ name: "Dhruv Garg", url: "https://www.linkedin.com/in/dhruvgarg001/" }],
  keywords: ["digit span test", "psychology", "memory test", "cognitive assessment", "MSU"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
