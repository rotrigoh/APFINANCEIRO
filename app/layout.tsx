import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PWARegister } from "@/components/pwa-register";
import { AppShell } from "@/components/layout/AppShell";
import { CircularCursor } from "@/components/ui/circular-cursor";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "APFinanceiro | Dashboard Imobiliário",
  description: "Plataforma inteligente de indicadores econômicos e mercado imobiliário brasileiro.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "APFinanceiro",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${roboto.variable} antialiased font-sans`}
      >
        <Providers>
          <CircularCursor />
          <AppShell>{children}</AppShell>
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
