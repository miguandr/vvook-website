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
	const thumbBase = "clamp(60px, 40px + 7.5vw, 162px)";
	const extraPhotos = talent.gallery?.slice(1) ?? [];
	const halfCount = Math.min(5, Math.ceil(extraPhotos.length / 2));
	const rightPhotos = extraPhotos.slice(0, halfCount);
	const leftPhotos = extraPhotos.slice(halfCount, halfCount * 2);
	const currentPosition = leftPhotos.length + 1;

	return (
		<main className="pt-8 overflow-x-hidden">
			{/* Mobile/Tablet */}
			<div className="flex items-center justify-center gap-2 mb-3">
				<h1 className="font-menu text-[20px] lg:text-[24px] uppercase">
					{talent.name}
				</h1>
				{talent.instagram && (
					<a
					href={talent.instagram}
					target="_blank"
					rel="noopener noreferrer"
					className="md:hidden"
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
				<div className="flex-1 flex justify-end items-end min-w-0 overflow-hidden py-20">
					{leftPhotos.length > 0 && [...leftPhotos].reverse().map((photo, i) => {
						const distance = leftPhotos.length - 1 - i;
						return (
							<div
								key={i}
								style={{
									width: `calc(${thumbBase} * ${1 - distance * 0.125})`,
									marginLeft: i === 0 ? undefined : "clamp(-36px, -63.6px + 4.8vw, -5px)",
									transform: `perspective(100px) rotateY(${distance === 0 ? 25 : 30}deg)`,
									zIndex: 10 - distance,
									filter: `brightness(${72 - distance * 12}%)`,
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

				{/* Main Photo */}
				{talent.gallery?.[0] && (
					<div className="relative aspect-900/1222 h-[clamp(400px,calc(100vh-120px),670px)] z-20">
						<Image
							src={urlFor(talent.gallery[0]).width(900).height(1222).url()}
							alt={talent.name ?? "Talent"}
							fill
							sizes="500px"
							className="object-contain"
							priority
						/>
						<p className="absolute top-full left-0 font-menu text-[12px] lg:text-[14px] text-vvook-yellow">
							{`${String(currentPosition).padStart(2, "0")}/${String(talent.gallery?.length ?? 0).padStart(2, "0")}`}
						</p>
						{talent.instagram && (
							<a
								href={talent.instagram}
								target="_blank" rel="noopener noreferrer"
								className="absolute top-full right-0 mt-1">
								<InstagramIcon color="text-white" />
							</a>
						)}
					</div>

				)}

				{/* Right Fan */}
				<div className="flex flex-1 items-end min-w-0 overflow-hidden py-20">
					{rightPhotos.length > 0 && [...rightPhotos].map((photo, i) => (
						<div
							key={i}
							style={{
								width: `calc(${thumbBase} * ${1 - i * 0.125})`,
								marginLeft: i === 0 ? undefined : "clamp(-36px, -63.6px + 4.8vw, -5px)",
								transform: `perspective(100px) rotateY(${i === 0 ? -25 : -30}deg)`,
								zIndex: 10 - i,
								filter: `brightness(${72 - i * 12}%)`,
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
			</div>

			{/* Measuraments */}
			<div className={`grid ${extraValue != null ? "grid-cols-6" : "grid-cols-5"} justify-items-center lg:gap-x-[clamp(92px,44.5px+4.64vw,128px)] max-w-md mx-auto mt-8 lg:mt-12 mb-4 font-menu text-[12px] lg:text-[14px] uppercase text-center justify-center text-vvook-grey`}>
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
