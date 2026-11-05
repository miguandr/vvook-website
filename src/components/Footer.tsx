"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const textColor = isHome ? "text-vvook-black" : "text-vvook-white";
	const bgColor = isHome ? "bg-vvook-yellow" : "bg-vvook-black";

	return (
		<footer>
			{/* Mobile */}
			<div className={`grid grid-cols-2 items-end px-4 py-6 lg:hidden ${bgColor}`}>
				<p className="font-menu uppercase text-vvook-grey">© Vvook Management {new Date().getFullYear()}</p>
				<div className="flex flex-col text-right justify-self-end">
					<p className="font-menu uppercase -mb-1 text-vvook-grey ">Site by</p>
					<a
						href="https://www.linkedin.com/in/miguandr/"
						target="_blank"
						rel="noopener noreferrer"
						className={`font-menu uppercase ${textColor}`}
					>
						Miguel Andrade
					</a>
				</div>
			</div>

			{/* Desktop */}
			<div className="hidden lg:block bg-vvook-black">
				<p aria-hidden="true" className="font-menu text-xs text-vvook-grey whitespace-pre overflow-hidden">
					{/* ticker text — purely decorative, repeats visually */}
					· BERLIN · 2024 · 011     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 012     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 013     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 014     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 015     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 016     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 017     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 018     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 019     ——     VVOOK MANAGEMENT · BERLIN · 2024 · 020
				</p>

				<div className="text-center font-serif mt-40">
					<a href="mailto:info@vvookmanagement.com" className="text-white text-7xl">
						info@vvookmanagement.com
					</a>
					<p className="text-vvook-grey text-3xl mt-10 mb-28">
						+49 179 9921446
					</p>
				</div>

				<div className="flex justify-between items-end px-16 py-6">
					<div className="flex flex-col">
						<Link href="/legal/impressum" className="font-menu uppercase text-white">Impressum</Link>
						<Link href="/legal/privacy" className="font-menu uppercase text-white">Privacy Policy</Link>
						<Link href="/legal/terms" className="font-menu uppercase text-white">Terms of Use</Link>
					</div>
					<div className="flex flex-col justify-center font-menu text-vvook-grey uppercase">
						<p className="-mb-1">Goltzstr. 25</p>
						<p>10781 Berlin</p>
					</div>
					<div className="flex flex-col text-right justify-self-end">
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
			</div>
		</footer>
	)
}
