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
			<div className="text-center font-menu mt-20 lg:mt-24 px-gutter">
				<a href="mailto:info@vvookmanagement.com" className="text-white uppercase text-[clamp(20px,13.07px+1.849vw,32px)]
					lg:text-[clamp(32px,-16.18px+3.186vw,45px)]">
					info@vvookmanagement.com
				</a>
				<a href="tel:+491799921446" className="block text-white text-[clamp(16px,11.38px+1.233vw,24px)] mt-2 mb-10
					lg:text-vvook-grey lg:text-[clamp(24px,-7.99px+3.222vw,32px)] lg:pointer-events-none lg:mt-0 lg:mb-8">
					+49 179 9921446
				</a>
			</div>
			<div className="flex flex-col gap-4 items-center px-gutter py-6
				md:flex-row md:justify-between md:items-center md:text-left">
				<div className="flex gap-2 items-center">
					<Link href="/legal/impressum" className="font-menu text-step--1  text-white">Impressum</Link>
					<span className="text-white/50">·</span>
					<Link href="/legal/privacy" className="font-menu text-step--1 text-white">Privacy</Link>
					<span className="text-white/50">·</span>
					<Link href="/legal/terms" className="font-menu text-step--1 text-white">Terms</Link>
				</div>
				<p className="font-menu text-step--1 text-vvook-grey">Goltzstr. 25, 10781 Berlin</p>
				<p className="font-menu text-step--1 text-vvook-grey text-right">Site by {" "}
					<a
						href="https://www.linkedin.com/in/miguandr/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-menu text-step--1 text-white"
					>
						Miguel Andrade
					</a>
				</p>
			</div>
		</footer>
	)
}
