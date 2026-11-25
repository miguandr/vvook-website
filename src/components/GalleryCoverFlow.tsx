"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import InstagramIcon from "@/components/InstagramIcon";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = Parameters<typeof urlFor>[0] & { _key?: string };

const THUMB_BASE_CSS = "clamp(60px, 40px + 7.5vw, 162px)";
const OVERLAP_CSS = "clamp(-36px, -63.6px + 4.8vw, -5px)";
const MAIN_HEIGHT_CSS = "clamp(480px, calc(100vh - 120px), 700px)";
const MAIN_ASPECT = 900 / 1222;
const THUMB_ASPECT = 300 / 500;
const MAX_SIDE = 5;

function resolvePx(prop: "width" | "marginLeft" | "height", value: string) {
	const el = document.createElement("div");
	el.style.position = "absolute";
	el.style.visibility = "hidden";
	el.style[prop] = value;
	document.body.appendChild(el);
	const n = parseFloat(getComputedStyle(el)[prop]);
	document.body.removeChild(el);
	return n;
}

export default function GalleryCoverflow({
	photos,
	name,
	instagram,
}: {
	photos: SanityImage[];
	name: string;
	instagram?: string;
}) {
	const [current, setCurrent] = useState(0);
	const [mainW, setMainW] = useState(0);
	const stageRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<Record<number, HTMLDivElement>>({});   // OUTER layer: position, size, brightness
	const innerRefs = useRef<Record<number, HTMLDivElement>>({});  // NEW — INNER layer: only perspective + rotation
	const geometry = useRef({ offsets: [] as number[], thumbBasePx: 0, mainW: 0, mainH: 0 });
	const total = photos.length;

	const computeGeometry = () => {
		const thumbBasePx = resolvePx("width", THUMB_BASE_CSS);
		const overlapPx = resolvePx("marginLeft", OVERLAP_CSS);
		const mainH = resolvePx("height", MAIN_HEIGHT_CSS);
		const w = mainH * MAIN_ASPECT;

		const offsets: number[] = [];
		let edge = w / 2;
		for (let d = 0; d < MAX_SIDE; d++) {
			const tw = thumbBasePx * (1 - d * 0.125);
			if (d > 0) edge += overlapPx;
			offsets[d] = edge + tw / 2;
			edge += tw;
		}
		geometry.current = { offsets, thumbBasePx, mainW: w, mainH };
		setMainW(w);
	};

	// CHANGED — position/size go to the outer layer, rotation to the inner layer
	const applyFor = (idx: number, animate: boolean) => {
		const { offsets, thumbBasePx, mainW: w, mainH } = geometry.current;
		const h0 = thumbBasePx / THUMB_ASPECT; // height of the biggest thumbnail (for bottom alignment)

		photos.forEach((_, i) => {
			const outer = itemRefs.current[i];
			const inner = innerRefs.current[i];
			if (!outer || !inner) return;
			const d = i - idx;
			const a = Math.abs(d);
			const sign = Math.sign(d) || 0;

			let outerVars: gsap.TweenVars;
			let rot = 0;

			if (a === 0) {
				outerVars = { width: w, height: mainH, x: 0, y: 0, zIndex: 20, filter: "brightness(100%)", opacity: 1 };
			} else if (a <= MAX_SIDE) {
				const tw = thumbBasePx * (1 - (a - 1) * 0.125);
				const th = tw / THUMB_ASPECT;
				outerVars = {
					width: tw,
					height: th,
					x: sign * offsets[a - 1],
					y: (h0 - th) / 2, // bottoms aligned, like "items-end" in the static version (use 0 to center them)
					zIndex: 10 - (a - 1),
					filter: `brightness(${72 - (a - 1) * 12}%)`,
					opacity: 1,
				};
				rot = -sign * (a === 1 ? 25 : 30);
			} else {
				outerVars = { width: 0, height: 0, x: sign * (offsets[MAX_SIDE - 1] ?? 0) * 1.4, opacity: 0 };
			}

			// perspective is LOCAL to each photo (from its own center), exactly like perspective(100px) in the static version
			const innerVars: gsap.TweenVars = { rotationY: rot, transformPerspective: 100 };

			if (animate) {
				const t = { duration: 0.6, ease: "back.out(0.2)", overwrite: "auto" as const };
				gsap.to(outer, { ...outerVars, xPercent: -50, yPercent: -50, ...t });
				gsap.to(inner, { ...innerVars, ...t });
			} else {
				gsap.set(outer, { ...outerVars, xPercent: -50, yPercent: -50 });
				gsap.set(inner, innerVars);
			}
		});
	};

	useLayoutEffect(() => {
		computeGeometry();
		applyFor(current, false);
		const onResize = () => { computeGeometry(); applyFor(current, false); };
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [total]);

	// NEW — intro "fan reveal": the thumbnails come out from behind the main photo, nearest first.
	// Must stay BELOW the useLayoutEffect above: it needs the final positions already set.
	// It only animates the INNER layer, so it never fights the outer layer (position / size).
	useGSAP(() => {
		const idx = current;
		const left: HTMLDivElement[] = [];  // far → near (same order as your .fan-left in the DOM)
		const right: HTMLDivElement[] = []; // near → far (same order as your .fan-right)
		for (let a = MAX_SIDE; a >= 1; a--) { const el = innerRefs.current[idx - a]; if (el) left.push(el); }
		for (let a = 1; a <= MAX_SIDE; a++) { const el = innerRefs.current[idx + a]; if (el) right.push(el); }

		const common = { rotationY: 0, scale: 0.1, opacity: 0, duration: 0.7, ease: "circ.in" };
		gsap.from(left, { ...common, x: (i) => (left.length - i) * 10, stagger: { each: 0.08, from: "end" } });
		gsap.from(right, { ...common, x: (i) => -(i + 1) * 10, stagger: 0.08 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [total]);

	const move = (dir: 1 | -1) => {
		setCurrent((c) => {
			const next = Math.max(0, Math.min(total - 1, c + dir));
			if (next !== c) applyFor(next, true);
			return next;
		});
	};

	useGSAP(() => {
		const el = stageRef.current;
		if (!el) return;
		let locked = false;
		const onWheel = (e: WheelEvent) => {
			if (e.clientY < 140) return; // leave the header area alone
			e.preventDefault();
			if (locked) return;
			const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			if (Math.abs(delta) < 10) return;
			locked = true;
			move(delta > 0 ? 1 : -1);
			setTimeout(() => { locked = false; }, 500);
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [total]);

	return (
		<div
			ref={stageRef}
			className="relative w-full"
			style={{ height: MAIN_HEIGHT_CSS }} // CHANGED — removed perspective / perspectiveOrigin (it's now per photo)
		>
			{photos.map((photo, i) => {
	const isMain = i === current;
	const src = isMain
		? urlFor(photo).width(900).height(1222).url()
		: urlFor(photo).width(125).height(213).url();

	return (
		<div key={photo._key ?? i} ref={(el) => { if (el) itemRefs.current[i] = el; }} className="absolute left-1/2 top-1/2">
			<div ref={(el) => { if (el) innerRefs.current[i] = el; }} className="relative w-full h-full">
				<Image src={src} alt="" fill sizes="500px" className="object-contain" />
			</div>
		</div>
	);
})}


			<div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-vvook-black to-transparent pointer-events-none z-25"
				style={{ bottom: "-6%" }}/>
				<div
					className="absolute left-1/2 bottom-0 pointer-events-none z-30"
					style={{ width: mainW, height: "33%", transform: "translateX(-50%)" }}
				>
					<div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
						<h1 className="font-menu text-[clamp(18px,10.59px+0.490vw,21px)] text-white">{name}</h1>
						<p className="absolute top-full left-0 font-menu text-[12px] text-vvook-yellow">
							{`${String(current + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`}
						</p>
						{instagram && (
							<a href={instagram} target="_blank" rel="noopener noreferrer" className="absolute top-full right-0 pointer-events-auto">
								<InstagramIcon color="text-white" />
							</a>
						)}
					</div>
				</div>

		</div>
	);
}
