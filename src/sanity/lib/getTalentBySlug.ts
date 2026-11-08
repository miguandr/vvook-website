import { client } from './client';

import { TALENT_DETAIL_QUERY } from './queries';

export async function getTalentBySlug(slug: string) {
	const details = await client.fetch(TALENT_DETAIL_QUERY, { slug: slug });
	return details;
}
