import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import { Bebas_Neue } from "next/font/google";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-bebas",
});

const dmMono = DM_Mono({
	weight: "500",
	subsets: ["latin"],
	variable: "--font-dm",
})

const anonymousPro = Anonymous_Pro({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-anonymous",
})


export const metadata: Metadata = {
  title: "Vvook Management",
  description: "Berlin based talent management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmMono.variable} ${anonymousPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
