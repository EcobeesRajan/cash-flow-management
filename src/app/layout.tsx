import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthProviderWrapper from "@/(auth)/AuthProviderWrapper";

export const metadata: Metadata = {
  title: "Cash Flow App",
  description: "Login and manage your cash flow",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
