import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrainerTracker - Entraînement Intelligent",
  description:
    "Application de gestion d'entraînement avec calcul automatique des zones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
