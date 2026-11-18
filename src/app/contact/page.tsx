import Link from "next/link";
import LogoMark from "@/components/LogoMark";

export default function Contact() {
	return (
		<main className="bg-vvook-black min-h-dvh flex flex-col px-gutter">

			{/* Circle + logo */}
			<div className="md:hidden flex-1 flex items-center justify-center mt-20 mb-8">
				<div className="relative rounded-full bg-vvook-yellow aspect-square w-[min(59.2vw,238px)] md:w-[min(26.46vw,400px)] flex items-center justify-center">
					<div className="w-[86.4%]">
						<LogoMark color="text-vvook-black" />
					</div>
				</div>
			</div>

			{/* Mobile Contact + Address + Legals */}
			<div className="flex flex-col items-center text-center gap-8 font-menu text-[14px] md:hidden">
				<div className="flex flex-col gap-2 items-center md:items-start">
					<p className="text-white">Contact</p>
					<a href="tel:+491799921446" className="text-vvook-grey lg:pointer-events-none">
						+49 179 9921446
					</a>
					<a href="mailto:info@vvookmanagement.com" className="text-vvook-grey">
						info@vvookmanagement.com
					</a>
				</div>
				<div className="flex flex-col gap-2 items-center">
					<p className="text-white">Address</p>
					<p className="text-vvook-grey text-center md:text-right">Goltzstr. 25, 10781 Berlin</p>
				</div>
				<div className="flex flex-col gap-2 items-center">
					<p className="text-white">Legals</p>
					<div>
						<Link href="/legal/impressum" className="font-menu text-step-1 text-vvook-grey">IMPRESUM</Link>
						<span className="text-vvook-grey"> · </span>
						<Link href="/legal/privacy" className="font-menu text-step-1 text-vvook-grey">PRIVACY</Link>
						<span className="text-vvook-grey"> · </span>
						<Link href="/legal/terms" className="font-menu text-step-1 text-vvook-grey">TERMS</Link>
					</div>
				</div>
			</div>

			{/* Mobile  copyright + site credit  */}
			<div className="flex flex-col items-center text-center gap-6 font-menu text-[14px] mt-14 md:hidden">
				<div className="flex items-end justify-between w-full text-step--1">
					<p className="text-vvook-grey">© Vvook Management 2026</p>
					<div className="flex items-baseline gap-1.5">
						<p className="text-whiite">site by</p>
						<a
							href="https://www.linkedin.com/in/miguandr/"
							target="_blank"
							rel="noopener noreferrer"
							className="font-menu text-step--1 text-vvook-grey"
						>
							Miguel Andrade
						</a>
					</div>
				</div>
			</div>

			{/* Desktop: Logo / Contact + Address*/}
			<div className="hidden flex-1 mt-20 mb-8 md:pb-[clamp(3.00rem,-2.71rem+8.929vw,8.00rem)] md:grid md:grid-cols-3 md:items-center">
				<div className="hidden md:flex md:flex-col font-menu text-step-0">
					<p className="text-white">Contact</p>
					<a href="tel:+491799921446" className="text-vvook-grey lg:pointer-events-none">+49 179 9921446</a>
					<a href="mailto:info@vvookmanagement.com" className="text-vvook-grey">info@vvookmanagement.com</a>
				</div>

				<div className="relative rounded-full bg-vvook-yellow aspect-square w-[min(59.2vw,238px)] md:w-[min(26.46vw,400px)] flex items-center justify-center md:justify-self-center">
					<div className="w-[86.4%]">
						<LogoMark color="text-vvook-black" />
					</div>
				</div>

				<div className="hidden md:flex flex-col items-end text-right font-menu text-step-0 uppercase">
					<p className="text-white">Address</p>
					<p className="text-vvook-grey">Goltzstr. 25<br/> 10781 Berlin</p>
				</div>
			</div>

			{/* Desktop: Legals + copyright + site credit */}
			<div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-end font-menu text-step-0 uppercase mb-4">
				<div className="flex flex-col">
					<p className="text-white">Legals</p>
					<div>
						<Link href="/legal/impressum" className="text-vvook-grey">Impressum</Link>
						<span className="text-vvook-grey"> · </span>
						<Link href="/legal/privacy" className="text-vvook-grey">Privacy</Link>
						<span className="text-vvook-grey"> · </span>
						<Link href="/legal/terms" className="text-vvook-grey">Terms</Link>
					</div>
				</div>
				<p className="text-vvook-grey">© Vvook Management 2026</p>
				<div className="flex flex-col items-end text-right">
					<p className="text-white">Site by</p>
					<a
						href="https://www.linkedin.com/in/miguandr/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-vvook-grey"
					>
						Miguel Andrade
					</a>
				</div>
			</div>
		</main>
	)
}
