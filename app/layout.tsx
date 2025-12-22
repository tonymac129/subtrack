import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import Gate from "./Gate";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard | Subtrack",
  description: "Subtrack is the best manager for keeping track of all your subscriptions, accounts, projects, and more!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Gate>
          <Nav />
          <div className="flex pl-45">
            <Sidebar />
            {children}
          </div>
        </Gate>
      </body>
    </html>
  );
}
