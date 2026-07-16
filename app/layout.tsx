import type { Metadata } from "next";
import { Manrope, Newsreader, Poppins } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "seConecta — Encontre sua próxima oportunidade",
  description: "Oportunidades, prazos e orientação para acelerar sua jornada educacional.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${newsreader.variable} ${poppins.variable}`}>{children}</body>
    </html>
  );
}
