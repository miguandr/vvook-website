"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

/* 10px at a 375px-wide screen → 14px at 1440px, fixed outside that range.
   Formula (to change the numbers): slope = (maxPx - minPx) / (maxW - minW)
   → vw = slope * 100;  intercept = minPx - minW * slope
   (4 / 1065 = 0.003756 → 0.376vw;  10 - 375 * 0.003756 = 8.59px)            */
const fluidText = "md:text-[clamp(10px,8.59px_+_0.376vw,14px)]";

function NavLink({
	href,
	children,
	className = "",
	external = false,
}: {
	href: string;
	children: string;
	className?: string;
	external?: boolean;
}) {
	return external ? (
		<a href={href} target="_blank" rel="noopener noreferrer" className={className}>
			{children}
		</a>
	) : (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

export default function Header() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const textColor = isHome ? "text-vvook-black" : "text-vvook-white";
	const logoColor = isHome ? "text-vvook-black" : "text-vvook-yellow";
	const isModelPage = !["/", "/about", "/contact"].includes(pathname) && !pathname.startsWith("/legal/");
	const link = `font-menu ${fluidText} ${textColor} whitespace-nowrap`;
	// {`${isModelPage ? "lg:fixed" : "fixed"}

	return (
		<header className={`${isModelPage ? "" : "fixed"} top-0 inset-x-0 z-10`}>
			{/* Mobile */}
			<div className="md:hidden">
				<div className="grid grid-cols-3 items-center px-4 py-4">
					<div className="flex gap-8 font-menu">
						<NavLink href="/" className={`font-menu ${textColor}`}>MODELS</NavLink>
						<a
							href="https://www.instagram.com/vvookmanagement/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${textColor}`}
						>
							INSTA
						</a>
					</div>

					<div className="w-28 justify-self-center">
						<Link href="/"><Logo color={logoColor} /></Link>
					</div>

					<div className="flex gap-8 font-menu justify-self-end">
						<NavLink href="/about" className={`font-menu ${textColor}`}>ABOUT</NavLink>
						<NavLink href="/contact" className={`font-menu ${textColor}`}>CONTACT</NavLink>
					</div>
				</div>
			</div>

			{/* Tablet + Desktop */}
			<nav className={`max-w-[1800px] mx-auto hidden md:grid grid-cols-12 items-center py-4 md:px-5 lg:px-16`}>
				<div className="col-span-2 text-left">
					<NavLink href="/" className={link}>MODELS</NavLink>
				</div>
				<div className="col-span-2 text-left">
					<NavLink href="https://www.instagram.com/vvookmanagement/" external className={link}>
						INSTA
					</NavLink>
				</div>


				<div className="col-span-4 flex justify-center">
					<Link href="/" className="block w-[45%]" aria-label="Vvook Management home">
						<Logo color={logoColor} />
					</Link>
				</div>

				<div className="col-span-2 text-right">
					<NavLink href="/about" className={link}>ABOUT</NavLink>
				</div>
				<div className="col-span-2 text-right">
					<NavLink href="/contact" className={link}>CONTACT</NavLink>
				</div>
			</nav>
		</header>
	);
}
