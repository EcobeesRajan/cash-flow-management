import React from "react";
import { AuthProvider } from "@/(auth)/AuthContext";

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider> {children}</AuthProvider>;
}
