"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

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
	const link = `font-menu ${textColor} whitespace-nowrap`;

	return (
		<header className={`${isModelPage ? "" : "fixed"} px-gutter top-0 inset-x-0 z-10`}>
			{/* Mobile */}
			<div className="md:hidden">
				<div className="grid grid-cols-3 items-center py-4">
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

					<div className="w-[27.61vw] justify-self-center">
						<Link href="/"><Logo color={logoColor} /></Link>
					</div>

					<div className="flex gap-8 font-menu justify-self-end">
						<NavLink href="/about" className={`font-menu ${textColor}`}>ABOUT</NavLink>
						<NavLink href="/contact" className={`font-menu ${textColor}`}>CONTACT</NavLink>
					</div>
				</div>
			</div>

			{/* Tablet + Desktop */}
			<nav className={`hidden md:grid grid-cols-12 items-center py-4`}>
				<div className="col-span-2 text-left">
					<NavLink href="/" className={link}>MODELS</NavLink>
				</div>
				<div className="col-span-2 text-left">
					<NavLink href="https://www.instagram.com/vvookmanagement/" external className={link}>
						INSTA
					</NavLink>
				</div>


				<div className="col-span-4 flex justify-center">
					<Link href="/" className="block md:w-[14.55vw]" aria-label="Vvook Management home">
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
