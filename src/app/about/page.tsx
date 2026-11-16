import Image from "next/image"

export default function About() {
	return (
		<main className="overflow-x-hidden -mt-10 md:mt-0 lg:mt-[clamp(96px,-91.424px+18.304vw,260px)]">
			<section className="relative">
				<h1 className=" relative px-gutter hero-title mt-39.5
					md:text-[16.4vw]">
					MODEL<br/>AGENCY
					<Image
						src="/Moses.jpg"
						width={226}
						height={302}
						alt="..."
						className="absolute w-[min(54.22vw,264px)] h-[min(74.12vw,360px)] top-[1.48em] right-gutter
							md:right-auto md:w-[1.81em] md:h-[2.42em] md:left-[calc(var(--spacing-gutter)+3.48em)] md:top-[0.81em]"
					/>
				</h1>
				<p className="font-body uppercase text-vvook-grey
					ml-[calc(var(--spacing-gutter)+11.09vw)] mt-hero-gap-mobile
					md:mt-hero-gap-tablet md:ml-[calc(var(--spacing-gutter)+33.85vw)]
					lg:mt-hero-gap-desktop">
					we celebrate
					<br/>
					diversity and
					<br/>
					emphasize
					<br/>
					authenticity.
				</p>
				<h2 className="px-gutter text-right hero-title mt-hero-gap-mobile
					md:mt-hero-gap-tablet md:text-[16.4vw]
					lg:mt-hero-gap-desktop">
					<span>
						BERLIN
					</span>
					<br/>
					BASED
				</h2>
			</section>
		</main>
	)
}
