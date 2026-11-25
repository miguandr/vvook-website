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
	const isModelPage = !["/", "/about", "/contact"].includes(pathname) && !pathname.startsWith("/legal/");

	const link = `font-menu whitespace-nowrap ${isHome ? "text-vvook-black" : "text-vvook-white"}`;
	const dotColor = isHome ? "bg-vvook-black" : "bg-vvook-white";
	const logoColor = isHome ? "text-vvook-black" : "text-vvook-yellow";
	const contactLabel = isContactPage ? "CLOSE" : "CONTACT";

	if (isModelPage) {
		return (
			<header className="px-gutter">
				<div className="md:hidden grid grid-cols-3 items-center">
					<div className="flex gap-8 font-menu items-center">
						<NavLink href="/" className={link}>MODELS</NavLink>
						<a
							href="https://www.instagram.com/vvookmanagement/"
							target="_blank"
							rel="noopener noreferrer"
							className={link}
						>
							INSTA
						</a>
					</div>
					<div className="w-[27.61vw] justify-self-center">
						<Link href="/"><Logo color={logoColor} /></Link>
					</div>
					<div className="flex gap-8 font-menu justify-self-end items-center">
						<NavLink href="/about" className={link}>ABOUT</NavLink>
						<NavLink href="/contact" className={link}>CONTACT</NavLink>
					</div>
				</div>
				<nav className="hidden md:grid grid-cols-12 items-center py-4">
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

	return (
		<>
			{/* Text layer — blended on non-Home pages, logo excluded entirely */}
			<header className={`fixed px-gutter top-0 inset-x-0 z-10 pointer-events-none ${isHome ? "" : "mix-blend-difference"}`}>

				{/* Mobile */}
				<div className="md:hidden">
					<div className="grid grid-cols-3 items-center py-4">

						<div className="flex gap-8 font-menu items-center pointer-events-auto">
							<div className="flex items-center">
								<Dot color={dotColor} active={isHome} />
								<NavLink href="/" className={link}>MODELS</NavLink>
							</div>
							<a
								href="https://www.instagram.com/vvookmanagement/"
								target="_blank"
								rel="noopener noreferrer"
								className={link}
							>
								INSTA
							</a>
						</div>

						<div />

						<div className="flex gap-8 font-menu justify-self-end items-center pointer-events-auto">
							<div className="flex items-center">
								{isAboutPage && <Dot color={dotColor} active={isAboutPage} />}
								<NavLink href="/about" className={link}>ABOUT</NavLink>
							</div>
							<div className="flex items-center min-w-[8ch] justify-end">
								{isContactPage && <Dot color={dotColor} active={isContactPage} />}
								{isContactPage ? (
									<button onClick={() => router.back()} className={link}>{contactLabel}</button>
									) : (
									<NavLink href="/contact" className={link}>{contactLabel}</NavLink>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Tablet + Desktop */}
				<nav className="hidden md:grid grid-cols-12 items-center py-4">
					<div className="col-span-2 text-left flex items-center pointer-events-auto">
						<Dot color={dotColor} active={isHome} />
						<NavLink href="/" className={link}>MODELS</NavLink>
					</div>
					<div className="col-span-2 text-left pointer-events-auto">
						<NavLink href="https://www.instagram.com/vvookmanagement/" external className={link}>
							INSTA
						</NavLink>
					</div>

					<div className="col-span-4" />

					<div className="col-span-2 text-right flex items-center justify-end pointer-events-auto">
						{isAboutPage && <Dot color={dotColor} active={isAboutPage} />}
						<NavLink href="/about" className={link}>ABOUT</NavLink>
					</div>
					<div className="col-span-2 flex items-center justify-end min-w-[8ch] pointer-events-auto">
						{isContactPage && <Dot color={dotColor} active={isContactPage} />}
						{isContactPage ? (
							<button onClick={() => router.back()} className={`${link} cursor-pointer`}>{contactLabel}</button>
						) : (
							<NavLink href="/contact" className={link}>{contactLabel}</NavLink>
						)}
					</div>
				</nav>
			</header>

			{/* Logo layer — separate fixed element, never blends */}
			<div className="fixed inset-x-0 top-0 z-10 py-4 flex justify-center pointer-events-none">
				<div className={`w-[27.61vw] md:w-[14.55vw] pointer-events-auto ${isContactPage ? "invisible" : ""}`}>
					<Link href="/" aria-label="Vvook Management home">
						<Logo color={logoColor} />
					</Link>
				</div>
			</div>
		</>
	);
}
