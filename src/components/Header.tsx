import Link from "next/link";
import Logo from "./Logo";

function NavLink({ href, children }: { href: string; children: string }) {
	return <Link href={href} className="font-menu text-sm">{children}</Link>
}

export default function Header() {
	return (
		<header>
			<div className="grid grid-cols-3 items-center px-12.5 py-4">
				<NavLink href="/about">About</NavLink>
				<div className="justify-self-center">
					<Link href="/"><Logo /></Link>
				</div>
				<div className="justify-self-end"><NavLink href="/contact">Contact</NavLink></div>
			</div>
		</header>
	)
}

