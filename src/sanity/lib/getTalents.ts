import { client } from './client';
import { TALENT_GRID_QUERY } from './queries';

export async function getTalents() {
	return client.fetch(TALENT_GRID_QUERY)
}
