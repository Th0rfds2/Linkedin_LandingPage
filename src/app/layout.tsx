import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ana Beatriz Ferraz | LinkedIn",
  description:
    "Perfil de Ana Beatriz Ferraz, Product Designer Sênior na Nubank. Design Systems, UX Research e Acessibilidade.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
