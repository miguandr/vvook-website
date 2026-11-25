"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function GalleryFanReveal() {
	useGSAP(() => {
		const left = gsap.utils.toArray<HTMLElement>(".fan-left").filter((t) => t.offsetParent !== null);
		const right = gsap.utils.toArray<HTMLElement>(".fan-right").filter((t) => t.offsetParent !== null);

		gsap.from(left, {
			x: (i) => (left.length - i) * 10,
			rotationY: 0,
			scale: 0.1,
			opacity: 0,
			duration: 0.7,
			ease: "circ.in",
			stagger: { each: 0.08, from: "end" },
		});
		gsap.from(right, {
			x: (i) => -(i + 1) * 10,
			rotationY: 0,
			scale: 0.1,
			opacity: 0,
			duration: 0.7,
			ease: "circ.in",
			stagger: 0.08,
		});
	});

	return null;
}
