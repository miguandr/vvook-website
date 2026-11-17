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

			{/* Mobile/Tablet */}
			<section className="bg-vvook-white mt-22 md:mt-45 pt-16 pl-16 md:pl-36 lg:hidden">
				<div className="flex flex-col gap-[clamp(5.625rem,4.27rem+6.024vw,8.125rem)] md:gap-20">
					<p className="font-title text-black">
						FOR US,
						<br/>
						SUCCESSFUL
						<br/>
						REPRESENTATION
						<br/>
						IS MORE THAN
						<br/>
						BOOKINGS.
					</p>
					<p className="max-w-[clamp(8.125rem,-8.48rem+73.81vw,10.0625rem)] ml-[clamp(9.13rem,-11.72rem+82.967vw,28.00rem)] mb-[clamp(3.375rem,2.562rem+3.614vw,4.875rem)] font-body text-black
						md:max-w-50 md:ml-88">
						RATHER THAN CHASING
						QUICK SUCCESS, WE TAKE
						THE TIME TO UNDERSTAND
						EACH TALENT AND DEVELOP
						THEIR POTENTIAL,
						BUILDING A CLEAR AND
						SUSTAINABLE PATH WITHIN
						THE INDUSTRY.
					</p>
				</div>
			</section>

			<div className="md:grid md:grid-cols-2 md:items-center lg:hidden">
				<Image
					src="/vvook-trio-mobile.jpg"
					width={362}
					height={530}
					alt="Three Vvook models"
					className="block ml-auto w-[min(90.05vw,691px)] h-[min(131.84vw,1011px)]
						md:order-2 md:ml-0 md:h-auto md:aspect-362/530]"
				/>
				<section className="px-gutter mt-12 md:translate-y-12 md:order-1">
					<div className="flex flex-col gap-16 md:gap-38">
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
						<p className="ml-[clamp(14.00rem,-4.95rem+75.410vw,31.25rem)] max-w-32.5 md:ml-46 mb-13.5 font-body text-white">
							WE SUPPORT OUR
							MODELS FROM THEIR
							FIRST STEPS,
							POSITION THEM
							THOUGHTFULLY IN THE
							GERMAN AND
							INTERNATIONAL
							MARKET, AND STAY
							CLOSE AND HONEST
							WITH THE PEOPLE
							<br/>
							WE REPRESENT
						</p>
					</div>
				</section>
			</div>

			{/* Mobile: Boris */}
			<section className=" md:hidden mt-12">
				<div className="relative w-full h-[150vw] overflow-hidden lg:hidden">
					<Image
						src="/Boris_mobile.jpg"
						priority
						fill
						sizes="100vw"
						alt="Founder Boris Kralj"
						className="object-cover object-[center_100%] scale-120"
					/>
				</div>
				<div className="py-8 ml-[clamp(10.75rem,-11.89rem+90.110vw,31.25rem)] mb-8 md:hidden">
					<p className="font-body text-vvook-grey">
						"STRONG CAREERS
						<br/>
						ARE NOT BUILT OVERNIGHT"
					</p>
					<div className="flex gap-3 items-end">
						<p className="font-serif text-[24px] mt-1 text-white leading-[0.98] ">
							BORIS KRALJ
						</p>
						<p className="font-body text-vvook-grey ">
							FOUNDER
						</p>
					</div>
				</div>
			</section>

			{/* Tablet: Boris */}
			<section className="hidden px-gutter md:grid md:grid-cols-2 lg:hidden mt-28">
				<div className="relative w-full mx-auto self-center aspect-582/850 overflow-hidden">
					<Image
						src="/Boris june 2026_4.jpg"
						priority
						alt="Founder Boris Kralj"
						fill
						sizes="40vw"
						className="object-cover object-bottom"
					/>
				</div>
				<div className="flex justify-center items-center">
					<div className="flex flex-col items-start gap-4">
						<p className="font-body-desktop text-[14px] text-vvook-grey">
							"STRONG CAREERS
							<br/>
							ARE NOT BUILT OVERNIGHT"
						</p>
						<div className="flex items-baseline gap-2">
							<p className="font-serif text-[28px] leading-[0.1] text-white">
								BORIS KRALJ
							</p>
							<p className="font-body-desktop text-[14px] text-vvook-grey">
								FOUNDER
							</p>
						</div>
					</div>
				</div>
			</section>


			{/* Desktop/Tablet */}
			<section className="hidden lg:grid mt-34 lg:grid-cols-2">
				<div className="relative w-[40vw] h-[55.6vw]">
					<Image
						src="/vvook-trio-desktop.jpg"
						priority
						alt="Three Vvook models"
						fill
						sizes="40vw"
						className="object-cover object-top"
					/>
				</div>
				<div className="relative bg-vvook-white h-[55.6vw] ">
					<p className="absolute left-[min(9.06vw,174px)] top-[min(21.16vw,406px)] font-title-desktop text-black max-w-[min(36.2vw,695px)]">
						FOR US, SUCCESSFUL
						<br/>
						REPRESENTATION IS
						<br/>
						MORE THAN BOOKINGS
					</p>
					<p className="absolute left-[min(24.54vw,471px)] top-[min(33.73vw,648px)] font-body-desktop text-[14px] text-black max-w-[clamp(241px,21.34vw,270px)]">
						RATHER THAN CHASING QUICK SUCCESS,
						WE TAKE THE TIME TO UNDERSTAND EACH
						TALENT AND DEVELOP THEIR POTENTIAL,
						BUILDING A CLEAR AND SUSTAINABLE PATH
						WITHIN THE INDUSTRY.
					</p>
				</div>
			</section>


			{/* Desktop: Boris */}
			<section className="hidden lg:grid lg:grid-cols-2 mt-32">
				<div className="flex justify-center items-center pl-[15%]">
					<div className="flex flex-col items-start gap-4">
						<p className="font-body-desktop text-[16px] text-vvook-grey">
							"STRONG CAREERS
							<br/>
							ARE NOT BUILT OVERNIGHT"
						</p>
						<div className="flex items-baseline gap-2">
							<p className="font-serif text-[32px] leading-[0.1] text-white">
								BORIS KRALJ
							</p>
							<p className="font-body-desktop text-[16px] text-vvook-grey">
								FOUNDER
							</p>
						</div>
					</div>
				</div>
				<div className="relative w-[70%] mx-auto self-center aspect-682/850 overflow-hidden">
					<Image
						src="/Boris june 2026_4.jpg"
						priority
						alt="Founder Boris Kralj"
						fill
						sizes="40vw"
						className="object-cover object-bottom "
					/>
				</div>
			</section>
		</main>
	)
}
