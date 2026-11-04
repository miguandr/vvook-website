import { defineQuery } from "next-sanity";

export const TALENT_GRID_QUERY = defineQuery(`*[_type == "talent"]{ _id, name, mainPhoto }`)

export const HOMEPAGE_SETTINGS_QUERY = defineQuery(`
	*[_type == "homepageSettings"][0]{
		orderedTalents[]->{_id, name, mainPhoto }
	}
`)
