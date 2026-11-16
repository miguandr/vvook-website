"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const isKnownPage = pathname === "/" || pathname === "/about" || pathname === "/contact" || pathname.startsWith("/legal/");

	if (!isKnownPage)
		return;

	return (
		<footer>
			<p aria-hidden="true" className="font-menu text-step--1 text-vvook-grey opacity-60 whitespace-pre overflow-hidden w-screen mx-[calc(50%-50vw)]">
				{/* ticker text — purely decorative, repeats visually */}
				· BERLIN · 2024 · 011        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 012        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 013        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 014        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 015        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 016        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 017        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 018        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 019        ——        VVOOK MANAGEMENT · BERLIN · 2024 · 020
			</p>
			<div className="text-center font-serif mt-20 lg:mt-24 px-gutter">
				<a href="mailto:info@vvookmanagement.com" className="text-white uppercase text-[clamp(20px,13.07px+1.849vw,32px)]
					lg:text-[clamp(32px,-16.18px+3.186vw,45px)]">
					info@vvookmanagement.com
				</a>
				<a href="tel:+491799921446" className="block text-white text-[clamp(16px,11.38px+1.233vw,24px)] mt-2 mb-10
					lg:text-vvook-grey lg:text-[clamp(24px,-7.99px+3.222vw,32px)] lg:pointer-events-none lg:mt-0 lg:mb-8">
					+49 179 9921446
				</a>
			</div>
			<div className="flex justify-between items-end px-gutter py-6">
				<div className="flex flex-col">
					<Link href="/legal/impressum" className="font-menu uppercase text-white">Impressum</Link>
					<Link href="/legal/privacy" className="font-menu uppercase text-white">Privacy Policy</Link>
					<Link href="/legal/terms" className="font-menu uppercase text-white">Terms of Use</Link>
				</div>
				<div className="flex flex-col font-menu text-vvook-grey uppercase">
					<p className="-mb-1">Goltzstr. 25</p>
					<p>10781 Berlin</p>
				</div>
				<div className="flex flex-col text-right">
					<p className="font-menu uppercase -mb-1 text-vvook-grey ">Site by</p>
					<a
						href="https://www.linkedin.com/in/miguandr/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-menu uppercase text-white"
					>
						Miguel Andrade
					</a>
				</div>
			</div>
		</footer>
	)
}
