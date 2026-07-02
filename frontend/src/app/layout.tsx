import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "AI Emergency Government Navigator",
  description: "Official government dashboard for citizen real-time emergency guidance, SOS alerts, disaster management, and security procedures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
