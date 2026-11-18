"use client";

import { usePathname, useRouter } from "next/navigation";
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

function Dot({ color, active }: { color: string; active: boolean }) {
	return <span className={`inline-block w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mr-1 ${color} ${active ? "" : "invisible"}`} />;
}

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const isHome = pathname === "/";
	const isAboutPage = pathname === "/about";
	const isContactPage = pathname === "/contact";
	const textColor = isHome ? "text-vvook-black" : "text-vvook-white";
	const logoColor = isHome ? "text-vvook-black" : "text-vvook-yellow";
	const dotColor = isHome ? "bg-vvook-black" : "bg-vvook-yellow";
	const isModelPage = !["/", "/about", "/contact"].includes(pathname) && !pathname.startsWith("/legal/");
	const link = `font-menu ${textColor} whitespace-nowrap`;
	const contactLabel = isContactPage ? "CLOSE" : "CONTACT";

	return (
		<header className={`${isModelPage ? "" : "fixed"} px-gutter top-0 inset-x-0 z-10`}>

			{/* Mobile */}
			<div className="md:hidden">
				<div className="grid grid-cols-3 items-center py-4">

					{/* Models + Insta */}
					<div className="flex gap-8 font-menu items-center">
						<div className="flex items-center">
							<Dot color={dotColor} active={isHome} />
							<NavLink href="/" className={`font-menu ${textColor}`}>MODELS</NavLink>
						</div>
						<a
							href="https://www.instagram.com/vvookmanagement/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${textColor}`}
						>
							INSTA
						</a>
					</div>

					{/* Logo */}
					<div className={`w-[27.61vw] justify-self-center ${isContactPage ? "invisible" : ""}`}>
						<Link href="/"><Logo color={logoColor} /></Link>
					</div>

					{/* About + Contact */}
					<div className="flex gap-8 font-menu justify-self-end items-center">
						<div className="flex items-center">
							{isAboutPage && <Dot color={dotColor} active={isAboutPage} />}
							<NavLink href="/about" className={`font-menu ${textColor}`}>ABOUT</NavLink>
						</div>
						<div className="flex items-center min-w-[8ch] justify-end">
							{isContactPage && <Dot color={dotColor} active={isContactPage} />}
							{isContactPage ? (
								<button onClick={() => router.back()} className={`font-menu ${textColor}`}>{contactLabel}</button>
								) : (
								<NavLink href="/contact" className={`font-menu ${textColor}`}>{contactLabel}</NavLink>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Tablet + Desktop */}
			<nav className={`hidden md:grid grid-cols-12 items-center py-4`}>

				{/* Models + Insta */}
				<div className="col-span-2 text-left flex items-center">
					<Dot color={dotColor} active={isHome} />
					<NavLink href="/" className={link}>MODELS</NavLink>
				</div>
				<div className="col-span-2 text-left">
					<NavLink href="https://www.instagram.com/vvookmanagement/" external className={link}>
						INSTA
					</NavLink>
				</div>

				{/* Logo */}
				<div className={`col-span-4 flex justify-center ${isContactPage ? "invisible" : ""}`}>
					<Link href="/" className="block md:w-[14.55vw]" aria-label="Vvook Management home">
						<Logo color={logoColor} />
					</Link>
				</div>

				{/* About + Contact */}
				<div className="col-span-2 text-right flex items-center justify-end">
					{isAboutPage && <Dot color={dotColor} active={isAboutPage} />}
					<NavLink href="/about" className={link}>ABOUT</NavLink>
				</div>
				<div className="col-span-2 flex items-center justify-end min-w-[8ch]">
					{isContactPage && <Dot color={dotColor} active={isContactPage} />}
					{isContactPage ? (
						<button onClick={() => router.back()} className={`font-menu ${textColor} whitespace-nowrap cursor-pointer`}>{contactLabel}</button>
					) : (
						<NavLink href="/contact" className={`font-menu ${textColor} whitespace-nowrap`}>{contactLabel}</NavLink>
					)}
				</div>
			</nav>
		</header>
	);
}
