import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/layout-client"; // Composant client global
import React from 'react';

// Chargement des polices Geist (sans & mono)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Métadonnées globales de l'application
export const metadata = {
  title: "Breezy",
  description: "Réseau social léger",
    icons: {
    icon: "/favicon.ico",
  },
};

// Layout racine de l'application (appliqué à toutes les routes)
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* LayoutClient gère le wrapper global côté client (contextes, thèmes, etc.) */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
