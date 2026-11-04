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
			description: 'Drag to arrange the models. The order here is the order they appear on the homepage.',
			of: [{ type: 'reference', to: [{ type: 'talent' }] }],
			options: { layout: 'grid' },
			validation: (Rule) => Rule.unique()
		}),
	],
	preview: {
		prepare: () => ({ title: 'Homepage Settings' }),
	},
})
