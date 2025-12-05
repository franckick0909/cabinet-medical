import SmoothScroll from "@/components/common/SmoothScroll";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import {
  Bebas_Neue,
  Cormorant_Garamond,
  Inter,
  Oswald,
  Syne,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Syne - Police moderne et distinctive pour les titres
const syne = Syne({
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Police Stardom - locale
const stardom = localFont({
  src: [
    {
      path: "../../public/fonts/Stardom-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Stardom-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-stardom",
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Cabinet Médical - Prise de RDV",
  description:
    "Plateforme de prise de rendez-vous pour soins infirmiers à domicile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} ${syne.variable} ${stardom.variable} ${bebasNeue.variable} ${cormorantGaramond.variable} font-inter antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
