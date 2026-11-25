export function pickColumnCount(total: number, max: number): number {
	for (let n = max; n >= 3; n--) {
		if (total % n % 2 === 0) return n;
	}
	return 3;
}

export function distribute<T>(items: T[], columnCount: number): T[][] {
	const columns: T[][] = Array.from({ length: columnCount }, () => []);
	const base = Math.floor(items.length / columnCount);
	const remainder = items.length % columnCount;

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
