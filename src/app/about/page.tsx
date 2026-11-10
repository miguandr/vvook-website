import Image from "next/image"

//lg:w-[1.70em] lg:h-[2.2em] lg:top-[0.81em] lg:left-[3.69em]

export default function About() {
	return (
		<main className="overflow-x-hidden -mt-10 md:mt-0 lg:mt-[clamp(96px,-91.424px+18.304vw,260px)]">
			<section className="relative">
				<h1 className=" relative px-gutter font-serif leading-[80%] text-[22.89vw] md:text-[16.4vw] mt-39.5 ">
					MODEL<br/>AGENCY
					<Image
						src="/Moses.jpg"
						width={226}
						height={302}
						alt="..."
						className="absolute w-[min(54.22vw,264px)] h-[min(74.12vw,360px)] top-[1.48em] right-gutter md:w-[29.76vw] md:h-[39.68vw] md:top-[13.30vw] md:left-[61.3vw]"
					/>
				</h1>
				<p className="font-menu uppercase text-vvook-grey ml-[calc(1.38px+15.416vw)] mt-hero-gap-mobile md:ml-[calc(1.38px+38.176vw)] md:mt-hero-gap-tablet lg:mt-hero-gap-desktop">
					we celebrate<br/>diversity and<br/>emphasize<br/>authenticity.
				</p>
				<h2 className="px-gutter mt-hero-gap-mobile md:mt-hero-gap-tablet lg:mt-hero-gap-desktop font-serif leading-[80%] text-[22.89vw] md:text-[16.4vw] text-right"><span>BERLIN</span><br/>BASED</h2>
			</section>
		</main>
	)
}
