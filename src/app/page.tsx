import { getHomepageTalents } from "@/sanity/lib/getHomepageTalents";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import type { Viewport } from "next";

export const viewport: Viewport = {
	themeColor: "#faff00",
};

function pickColumnCount(total: number, max: number): number {
	for (let n = max; n >= 3; n--) {
		if (total % n % 2 === 0) return n;
	}
	return 3;
}

function distribute<T>(items: T[], columnCount: number): T[][] {
	const columns: T[][] = Array.from({ length: columnCount }, () => []);
	const base = Math.floor(items.length / columnCount);
	const remainder = items.length % columnCount;

	// with 2 left in 4 columns, share in col 1 and 3
	const tailOrder =
		remainder === 2
			? [0, 2]
			: remainder === 1 && columnCount === 3
				? [1]
				: Array.from({ length: remainder }, (_, i) => i);

	let index = 0;
	for (let round = 0; round < base; round++) {
		for (let col = 0; col < columnCount; col++) {
			columns[col].push(items[index++]);
		}
	}
	tailOrder.forEach((col) => columns[col].push(items[index++]));

	return columns;
}

type Talent = Awaited<ReturnType< typeof getHomepageTalents>>[number];

function hasPhoto(talent: Talent): talent is Talent & {mainPhoto: NonNullable<Talent["mainPhoto"]> } {
	return talent.mainPhoto != null;
}


export default async function Home() {
	const talents = (await getHomepageTalents()).filter(hasPhoto);
	const desktopColumns = pickColumnCount(talents.length, 4);
	const [m1, m2] = distribute(talents, 2);
	const [t1, t2, t3] = distribute(talents, 3);
	const [d1, d2, d3, d4] = distribute(talents, 4);

	const Photo = ({ talent, priority }: { talent: (typeof talents)[number]; priority?: boolean }) => (
		<div className="group relative mb-4 overflow-hidden">
			<Image
				src={urlFor(talent.mainPhoto).width(800).height(1060).url()}
				alt={talent.name ?? "Talent"}
				width={400}
				height={530}
				priority={priority}
				className="lg:mb-1 h-auto w-full transition-transform duration-300 group-hover:scale-110 group-hover:animate-focus-pull"
			/>
			<span className="font-menu font-semibold absolute top-2 right-2 uppercase text-vvook-black opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-hover:animate-focus-pull">
				{talent.name}
			</span>
		</div>
	);

	const threeColumnClass =
		desktopColumns === 4
			? "hidden md:grid lg:hidden grid-cols-3 gap-4 px-4"
			: "hidden md:grid grid-cols-3 gap-5 px-5";

  return (
      <main className="bg-vvook-yellow text-vvook-black min-h-screen pt-24 md:pt-43 lg:pt-62">
		{/* Mobile: 2 columns */}
		<div className="grid grid-cols-2 gap-4 md:hidden">
			<div>{m1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			<div className="mt-14">{m2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
		</div>

		{/* 3 columns: tablet always, desktop if there isnt enough models for 4 */}
		<div className={threeColumnClass}>
			<div>{t1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			<div className="mt-14">{t2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			<div className="-mt-10">{t3.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
		</div>

		{/* 4 columns: Desktop, only when enough roster */}
		{desktopColumns === 4 && (
			<div className="hidden lg:grid grid-cols-4 gap-5 px-16">
				<div>{d1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="mt-24">{d2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="-mt-14">{d3.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="mt-10">{d4.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			</div>
		)}
    </main>
  );
}
