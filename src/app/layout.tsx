import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MathJaxProvider } from "@/components/mathjax/mathjax-provider";

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
    default: "Ludus",
    template: "%s · Ludus",
  },
  description:
    "Jogos de investigação do ensino médio com DUA/AEE: leitura em voz alta, sem cronômetro e no ritmo do estudante. Sala de Recursos da EEMTI José Cláudio de Araújo.",
  applicationName: "Ludus",
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
  themeColor: "#008241",
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
        <MathJaxProvider>{children}</MathJaxProvider>
        <Toaster />
      </body>
    </html>
  );
}
