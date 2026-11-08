import { getTalentBySlug } from "@/sanity/lib/getTalentBySlug";
import { notFound } from "next/navigation";
import InstagramIcon from "@/components/InstagramIcon";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";


type Params = Promise<{ slug: string }>;

export default async function Page({ params }: {params: Params}) {
	const { slug } = await params;
	const talent = await getTalentBySlug(slug);

	if (!talent) {
		notFound();
	}

	const extraLabel = talent.dress != null ? "Dress" : "Suit";
	const extraValue = talent.dress ?? talent.suit;
	const thumbWidths = ["w-14", "w-11", "w-9", "w-7", "w-5.5", "w-4"];
	const thumbBase = "clamp(90px, 40px + 4.9vw, 128px)";
	const rightPhotos = talent.gallery?.slice(1, 6) ?? [];
	const leftPhotos = talent.gallery?.slice(6, 11) ?? [];
	const currentPosition = leftPhotos.length + 1;

	return (
		<main className="pt-10 md:pt-[clamp(60px,-72px+14.89vw,160px)]">
			{/* Mobile/Tablet */}
			<div className="flex items-center justify-center gap-2 -mb-1">
				<h1 className="font-menu text-[16px] uppercase">
					{talent.name}
				</h1>
				{talent.instagram && (
					<a
					href={talent.instagram}
					target="_blank"
					rel="noopener noreferrer"
					>
					<InstagramIcon color="text-white"/>
					</a>
				)}
			</div>

			{/* Main Photo */}
			{talent.gallery?.[0] && (
				<div className=" mt-2 lg:mt-2">
					{/* Mobile */}
					<Image
						src={urlFor(talent.gallery[0]).width(900).height(1522).url()}
						alt={talent.name ?? "Talent"}
						width={402}
						height={679}
						className="w-full h-auto md:hidden"
						priority
					/>
				</div>
			)}

			{/* Mobile: Gallery + Counter */}
			<div className="md:hidden relative h-30">
				<p className=" absolute left-1/2 -translate-x-1/2 top-1/2 font-menu text-[12px] text-vvook-yellow ">
					{`${String(currentPosition).padStart(2, "0")}/${String(talent.gallery?.length ?? 0).padStart(2, "0")}`}
				</p>
				{talent.gallery && talent.gallery.length > 5 && (
					<div className="absolute left-0 flex  overflow-hidden items-end py-6  w-45">
						{[...leftPhotos].reverse().map((photo, i) => {
							const distance = leftPhotos.length - 1 - i;
							return (
								<div
									key={i}
									className={`${i === 0 ? "" : "-ml-1"} ${thumbWidths[distance]} shrink-0`}
									style={{
										transform: `perspective(40px) rotateY(${distance === 0 ? 25 : 30}deg)`,
										zIndex: 10 - distance,
										filter: `brightness(${85 - distance * 15}%)`,
									}}
								>
									<Image
										src={urlFor(photo).width(150).height(250).url()}
										alt=""
										width={48}
										height={130}
										className="w-full h-auto"
									/>
								</div>
							);
						})}
					</div>
				)}
				{talent.gallery && talent.gallery.length > 1 && (
					<div className="absolute right-0 flex justify-end overflow-hidden py-6 items-end w-45">
						{[...rightPhotos].map((photo, i) =>(
							<div
								key={i}
								className={`${i === 0 ? "" : "-ml-1"} ${thumbWidths[i]} shrink-0`}
								style={{
									transform: `perspective(40px) rotateY(${i === 0 ? -25 : -30}deg)`,
									zIndex:10 - i,
									filter: `brightness(${85 - i * 15}%)`,
								}}
							>
								<Image
									src={urlFor(photo).width(150).height(250).url()}
									alt=""
									width={48}
									height={130}
									className="w-full h-auto"
								/>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Desktop */}
			<div className="hidden md:flex items-center w-full">
				{/* Left Fan */}
				{leftPhotos.length > 0 && (
					<div className="flex-1 flex justify-end items-end">
						{[...leftPhotos].reverse().map((photo, i) => {
							const distance = leftPhotos.length - 1 - i;
							return (
								<div
									key={i}
									// className={`${i === 0 ? "" : "-ml-4"} shrink-0`}
									style={{
										width: `calc(${thumbBase} * ${1 - distance * 0.125})`,
										marginLeft: i === 0 ? undefined : "clamp(-36px, -63.6px + 4.8vw, -6px)",
										transform: `perspective(100px) rotateY(${distance === 0 ? 25 : 30}deg)`,
										zIndex: 10 - distance,
										filter: `brightness(${85 - distance * 15}%)`,
									}}
								>
									<Image
										src={urlFor(photo).width(300).height(500).url()}
										alt=""
										width={128}
										height={213}
										className="w-full h-auto"
									/>
								</div>
							);
						})}
					</div>
				)}

				{/* Main Photo */}
				{talent.gallery?.[0] && (
					<Image
						src={urlFor(talent.gallery[0]).width(900).height(1150).url()}
						alt={talent.name ?? "Talent"}
						width={448}
						height={610}
						className="w-[clamp(150px,118px+18.89vw,700px)] h-auto mx-1 z-20"
						priority
					/>
				)}

				{/* Right Fan */}
				{rightPhotos.length > 0 && (
					<div className="flex flex-1 items-end">
						{[...rightPhotos].map((photo, i) => (
							<div
								key={i}
								style={{
									width: `calc(${thumbBase} * ${1 - i * 0.125})`,
									marginLeft: i === 0 ? undefined : "clamp(-36px, -63.6px + 4.8vw, -6px)",
									transform: `perspective(100px) rotateY(${i === 0 ? -25 : -30}deg)`,
									zIndex: 10 - i,
									filter: `brightness(${85 - i * 15}%)`,
								}}
							>
								<Image
									src={urlFor(photo).width(300).height(500).url()}
									alt=""
									width={128}
									height={213}
									className="w-full h-auto"
								/>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Measuraments */}
			<div className={`grid ${extraValue != null ? "grid-cols-6" : "grid-cols-5"} max-w-md mx-auto mt-6 mb-6 font-menu text-[12px] uppercase text-center text-vvook-grey`}>
				<div><p>Height</p><p>{talent.height}</p></div>
				<div><p>Chest</p><p>{talent.chest}</p></div>
				<div><p>Waist</p><p>{talent.waist}</p></div>
				<div><p>Hips</p><p>{talent.hips}</p></div>
				<div><p>Shoes</p><p>{talent.shoes}</p></div>
				{extraValue != null && (
					<div><p>{extraLabel}</p><p>{extraValue}</p></div>
				)}
			</div>
		</main>
	)
}
