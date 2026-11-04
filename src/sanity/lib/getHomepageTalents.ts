import { client } from './client';
import { HOMEPAGE_SETTINGS_QUERY, TALENT_GRID_QUERY } from './queries';

export async function getHomepageTalents() {
	const [settings, allTalents] = await Promise.all([
		client.fetch(HOMEPAGE_SETTINGS_QUERY),
		client.fetch(TALENT_GRID_QUERY),
	]);

	const ordered = settings?.orderedTalents ?? [];
	const orderedIds = new Set(ordered.map((t) => t._id));
	const unordered = allTalents.filter((t) => !orderedIds.has(t._id));

	return [...ordered, ...unordered];
}
