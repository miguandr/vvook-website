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
				<p className="font-body text-vvook-grey
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


			<section className="px-gutter bg-vvook-white mt-22 pt-16 pl-16">
				<div className="flex flex-col gap-22.5">
					<p className="font-title text-black">
						FOR US,
						<br/>
						SUCCESFUL
						<br/>
						REPRESENTATION
						<br/>
						IS ABOUT MORE
						<br/>
						THAN BOOKINGS.
					</p>
					<p className="ml-36.5 mb-13.5 font-body text-black">
						RATHER THAN CHASING
						<br/>
						QUICK SUCCESS, WE TAKE
						<br/>
						THE TIME TO UNDERSTAND
						<br/>
						EACH TALENT AND DEVELOP
						<br/>
						THEIR POTENTIAL,
						<br/>
						BUILDING A CLEAR AND
						<br/>
						SUSTAINABLE PATH WITHIN
						<br/>
						THE INDUSTRY.
					</p>
				</div>
			</section>
			<Image
				src="/vvook-trio-mobile.jpg"
				width={362}
				height={530}
				alt="Three Vvook models"
				className="block ml-auto w-[90.05vw] h-[131.84vw] md:hidden"
			/>
			<section className="px-gutter mt-12 ">
				<div className="flex flex-col gap-16">
					<p className="font-title text-white">
						OUR APPROACH
						<br/>
						IS PERSONAL,
						<br/>
						<span>STRATEGIC</span>{" "}
						<span className="text-[12px]">
							 AND
						</span>
						<br/>
						SELECTIVE.
					</p>
					<p className="ml-56 mb-13.5 font-body text-white">
						WE SUPPORT OUR
						<br/>
						MODELS FROM THEIR
						<br/>
						FIRST STEPS,
						<br/>
						POSITION THEM
						<br/>
						THOUGHTFULLY IN THE
						<br/>
						GERMAN AND
						<br/>
						INTERNATIONAL
						<br/>
						MARKET, AND STAY
						<br/>
						CLOSE AND HONEST
						<br/>
						WITH THE PEOPLE
						<br/>
						WE RESPRESENT
					</p>
				</div>
			</section>

			<section className="mt-12">
				<div className="relative w-full h-[140vw] overflow-hidden md:hidden">
					<Image
						src="/Boris june 2026_4.jpg"
						fill
						sizes="100vw"
						alt="Founder Boris Krajl"
						className="object-cover object-[center_145%] scale-120"
					/>
				</div>
				<div className="px-gutter py-12 ml-32 mb-8">
					<p className="font-body text-vvook-grey">
						"STRONG CAREERS
						<br/>
						ARE NOT BUILT OVERNIGHT"
					</p>
					<div className="flex gap-3 items-end">
						<p className="font-serif text-[24px] mt-1 text-white leading-[0.98] ">
							BORIS KRAJL
						</p>
						<p className="font-body text-vvook-grey ">
							FOUNDER
						</p>
					</div>
				</div>
			</section>
		</main>
	)
}
