import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Ludus · Jogos do Ensino Médio",
    template: "%s · Ludus",
  },
  description:
    "Doze jogos de investigação das quatro áreas do ensino médio, com voz, sem cronômetro e no seu ritmo. Recurso DUA/AEE da Sala de Recursos da EEMTI José Cláudio de Araújo.",
  keywords: [
    "jogos educacionais",
    "ensino médio",
    "BNCC",
    "DUA",
    "AEE",
    "sala de recursos",
    "acessibilidade",
  ],
  authors: [{ name: "Sala de Recursos · EEMTI José Cláudio de Araújo" }],
};

export const viewport: Viewport = {
  themeColor: "#a560e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${baloo.variable} ${nunito.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
