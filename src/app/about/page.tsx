export default function About() {
	return (
		<main className="px-13 pt-16">
			<section>
				<hgroup className="w-fit mx-auto">
					<p className="font-display font-bold text-vvook-yellow text-base"> ABOUT</p>
					<h1 className="font-logo text-[12rem] leading-none -ml-1.5">Our Vision</h1>
				</hgroup>
				<p>
					<span aria-hidden="true" className="font-logo text-vvook-yellow">|00</span>
					Vvook Management is a Berlin-based model agency with a focus on individuality, character and long-term development.
				</p>
				<p>
					<span aria-hidden="true" className="font-logo text-vvook-yellow">|01</span>
					We believe that strong careers are not built overnight. Rather than chasing quick success, we take the time to understand each talent, develop their potential and create a clear and sustainable path within the industry.
				</p>
				<p>
					<span aria-hidden="true" className="font-logo text-vvook-yellow">|02</span>
					Our approach is personal, strategic and selective. We support our models from their first steps onwards, helping them grow with confidence while positioning them thoughtfully in the German and international market.
				</p>
			</section>
			<section className="flex justify-between">
				<div>
					<p>
						<span aria-hidden="true" className="font-logo text-vvook-yellow">|03</span>
						For us, successful representation is about more than bookings. It is about building lasting careers, creating the right opportunities and maintaining a close and honest relationship with the people we represent.
					</p>
					<h2>Founder</h2>
					<p>Boris Kralj</p>
					<p>Est. 2024</p>
				</div>
				{/* <Image src={...} alt="Boris Kralj" /> */}
			</section>
		</main>
	)
}
