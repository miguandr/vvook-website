import { client } from './client';
import { HOMEPAGE_SETTINGS_QUERY } from './queries';

export async function getHomepageTalents() {
	const settings = await client.fetch(HOMEPAGE_SETTINGS_QUERY);
	return settings?.orderedTalents ?? [];
}
