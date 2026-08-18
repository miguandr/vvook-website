import { defineQuery } from "next-sanity";

export const TALENT_GRID_QUERY = defineQuery(`*[_type == "talent"]{ name, mainPhoto }`)
