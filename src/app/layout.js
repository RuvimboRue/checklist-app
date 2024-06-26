import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Online Checklist",
  description: "Created by Ruvimbo Bumhudza",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>{children}</body>
    </html>
  </ClerkProvider>
  );
}
