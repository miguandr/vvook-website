"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { pickColumnCount, distribute } from "@/lib/distribute";
import type { getHomepageTalents } from "@/sanity/lib/getHomepageTalents";

gsap.registerPlugin(Flip);

type Talent = Awaited<ReturnType<typeof getHomepageTalents>>[number] & {
	mainPhoto: NonNullable<Awaited<ReturnType<typeof getHomepageTalents>>[number]["mainPhoto"]>;
};

export default function ModelGrid({ talents }: { talents: Talent[] }) {
	const gridRef = useRef<HTMLDivElement>(null);
	const stackRef = useRef<HTMLDivElement>(null);
	const veilRef = useRef<HTMLDivElement>(null);

	const desktopColumns = pickColumnCount(talents.length, 4);
	const [m1, m2] = distribute(talents, 2);
	const [t1, t2, t3] = distribute(talents, 3);
	const [d1, d2, d3, d4] = distribute(talents, 4);

	const { contextSafe } = useGSAP({ scope: gridRef });

	const openModel = contextSafe((talentId: string) => {
		const grid = gridRef.current!, stack = stackRef.current!;
		const cards = gsap.utils.toArray<HTMLElement>(".model-card", grid).filter((c) => c.offsetParent !== null);
		const clicked = cards.find((c) => c.dataset.id === talentId)!;
		const others = cards.filter((c) => c !== clicked);

		const rect = clicked.getBoundingClientRect();
		Object.assign(stack.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });

		const state = Flip.getState(cards);
		[...others].reverse().forEach((c) => stack.appendChild(c));
		stack.appendChild(clicked);
		gsap.set(cards, { rotation: 0, x: 0, y: 0 });

		const tl = gsap.timeline();
		tl.add(Flip.from(state, { targets: cards, duration: 1.05, ease: "power3.out", absolute: true, stagger: 0.03 }), 0)
			.to(veilRef.current, { opacity: 1, duration: 0.9, ease: "power2.inOut" }, 0.35)
			.to(others, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.1);
	});

	const Photo = ({ talent, priority }: { talent: Talent; priority?: boolean }) => (
		<div
			data-id={talent._id}
			onClick={() => openModel(talent._id)}
			className="model-card group relative mb-4 overflow-hidden card-reveal opacity-0 translate-y-10 cursor-pointer"
		>
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
			? "hidden md:grid lg:hidden grid-cols-3 gap-4 px-gutter"
			: "hidden md:grid grid-cols-3 gap-5 px-gutter";

	return (
		<div ref={gridRef}>
			<div ref={veilRef} className="fixed inset-0 bg-vvook-black opacity-0 pointer-events-none z-30" />
			<div ref={stackRef} className="fixed z-30 pointer-events-none" />

			<div className="grid grid-cols-2 gap-4 md:hidden">
				<div>{m1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="mt-14">{m2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			</div>

			<div className={threeColumnClass}>
				<div>{t1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="mt-14">{t2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				<div className="-mt-10">{t3.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
			</div>

			{desktopColumns === 4 && (
				<div className="mx-auto hidden lg:grid grid-cols-4 gap-5 px-gutter">
					<div>{d1.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
					<div className="mt-24">{d2.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
					<div className="-mt-14">{d3.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
					<div className="mt-10">{d4.map((t, i) => <Photo key={t._id} talent={t} priority={i === 0} />)}</div>
				</div>
			)}
		</div>
	);
}
