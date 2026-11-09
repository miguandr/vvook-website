import Image from "next/image"

export default function About() {
	return (
		<main className="overflow-x-hidden -mt-10 lg:mt-[clamp(96px,-94.02px+18.557vw,260px)]">
			<section className="">
				<h1 className=" relative max-w-[1800px] mx-auto px-4 md:px-5 lg:px-16 font-serif leading-[80%] text-[clamp(90px,34.74px+14.737vw,300px)] mt-39.5 ">
					MODEL<br/>AGENCY
					<Image
						src="/Moses3.jpg"
						width={226}
						height={302}
						alt="..."
						className="absolute w-[52vw] h-[70vw] top-[1.48em] left-[44vw] md:w-[35vw] md:h-[48vw] md:top-[14.75vw] md:left-[62vw] lg:w-[1.70em] lg:h-[2.2em] lg:top-[0.81em] lg:left-[3.69em]"

					/>
				</h1>
				<p className="font-menu px-12 md:px-0 md:w-fit md:mx-auto text-[12px] lg:text-[14px] uppercase mt-[58.75px] mb-[58.75px] md:mt-[clamp(129.38px,-6.69px+13.288vw,232.49px)]">
					we celebrate<br/>diversity and<br/>emphasize<br/>authenticity.
				</p>
				<h2 className="max-w-[1800px] mx-auto px-4 mt-[clamp(100px,-137.49px+23.196vw,250px)] md:px-5 lg:px-14 font-serif leading-[80%] text-[clamp(90px,34.74px+14.737vw,300px)] text-right">BERLIN<br/>BASED</h2>
			</section>
		</main>
	)
}
