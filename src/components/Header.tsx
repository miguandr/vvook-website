"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

function NavLink({ href, children, color }: { href: string; children: string; color: string }) {
	return <Link href={href} className={`font-menu ${color}`}>{children}</Link>
}

export default function Header() {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const textColor = isHome ? "text-vvook-black" : "text-vvook-white";
	const logoColor = isHome ? "text-vvook-black" : "text-vvook-yellow";

	return (
		<header className="fixed top-0 inset-x-0 z-10">
			<div className="grid grid-cols-3 items-center px-4 py-4">
				<div className="flex gap-5">
					<NavLink href="/" color={textColor}>MODELS</NavLink>
					<a
						href="https://www.instagram.com/vvookmanagement/"
						target="_blank"
						rel="noopener noreferrer"
						className={`font-menu ${textColor}`}
					>
						INSTA
					</a>
				</div>
				<div className="justify-self-center">
					<Link href="/"><Logo color={logoColor} /></Link>
				</div>
				<div className="flex gap-4 justify-self-end">
					<NavLink href="/about" color={textColor}>ABOUT</NavLink>
					<NavLink href="/contact" color={textColor}>CONTACT</NavLink>
				</div>
			</div>
		</header>
	)
}

