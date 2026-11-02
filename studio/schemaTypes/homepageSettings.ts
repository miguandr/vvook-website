import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'homepageSettings',
	title: 'Homepage Settings',
	type: 'document',
	fields: [
		defineField({
			name: 'orderedTalents',
			title: 'Model order',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'talent' }] }],
		}),
	],
})
