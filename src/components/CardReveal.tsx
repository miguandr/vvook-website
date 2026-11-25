"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CardReveal() {
	useGSAP(() => {
		const realCards = gsap.utils.toArray<HTMLElement>(".card-reveal").filter((card) => card.offsetParent !== null);

		ScrollTrigger.batch(realCards, {
			start: "top bottom",
			once: true,
			onEnter: (batch) =>
				gsap.to(batch, {
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
					stagger: 0.08,
				}),
		});
	});

	return null;
}
