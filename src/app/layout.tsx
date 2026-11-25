import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Anonymous_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";


const playfairDisplay = Playfair_Display({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-playfair",
});

const anonymousPro = Anonymous_Pro({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-mono",
})


export const metadata: Metadata = {
  title: "Vvook Management",
  description: "Berlin based talent management",
  authors: [{ name: "Miguel Andrade" }],
};

export const viewport: Viewport = {
	themeColor: "#080808",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anonymousPro.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vvook-black text-white">
		<Header />
		{children}
	  </body>
    </html>
  );
}
