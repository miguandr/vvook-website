import { defineQuery } from "next-sanity";

export const TALENT_GRID_QUERY = defineQuery(`
	*[_type == "talent"]{
		_id,
		name,
		slug,
		"mainPhoto": gallery[0]
	}
`)

export const HOMEPAGE_SETTINGS_QUERY = defineQuery(`
	*[_type == "homepageSettings"][0]{
		orderedTalents[]->{
			_id,
			name,
			slug,
			"mainPhoto": gallery[0]
		}
	}
`)

export const TALENT_DETAIL_QUERY = defineQuery(`
	*[_type == "talent" && slug.current == $slug][0]{
		name,
		slug,
		gallery,
		height,
		chest,
		waist,
		hips,
		shoes,
		suit,
		dress,
		instagram
	}
`)
