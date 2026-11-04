import { defineField, defineType } from "sanity";

export default defineType({
	name: 'talent',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			description: 'The name as it should appear on the site.',
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'slug',
			title: 'URL',
			type: 'slug',
			description: 'Click Generate. This becomes the web address for this model.',
			options: {
				source: 'name',
				maxLength: 96,
				slugify: (input) =>
					input
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/^-+|-+$/g, '')
						.slice(0, 96),
			},
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'mainPhoto',
			title: 'Main Photo',
			type: 'image',
			description: 'The photo shown in the models grid (it zooms in slightly when someone hovers over it).',
			options: { hotspot: true },
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'gallery',
			type: 'array',
			description: "The photos on this model's own page. Drag to reorder — the first one is shown first.",
			of: [{
					type: 'image',
					options: { hotspot: true, metadata: ['lqip'] },
				}],
			options: { layout: 'grid' }
		}),

		defineField({
			name: 'height',
			title: 'Height',
			type: 'number',
			description: 'In centimetres.',
		}),

		defineField({
			name: 'chest',
			title: 'Chest',
			type: 'number',
			description: 'In centimetres.',
		}),

		defineField({
			name: 'waist',
			title: 'Waist',
			type: 'number',
			description: 'In centimetres.',
		}),

		defineField({
			name: 'hips',
			title: 'Hips',
			type: 'number',
			description: 'In centimetres.',
		}),

		defineField({
			name: 'shoes',
			title: 'Shoes',
			type: 'number',
			description: 'EU size.',
		}),

		defineField({
			name: 'suit',
			title: 'Suit',
			type: 'number',
			description: 'EU size. Leave empty if not applicable.'
		}),

		defineField({
			name: 'dress',
			title: 'Dress',
			type: 'number',
			description: 'EU size. Leave empty if not applicable.'
		}),

		defineField({
			name: 'instagram',
			title: 'Instagram',
			type: 'url',
			description: 'The full link, e.g. https://instagram.com/username'
		}),
	],
	preview: {
		select: { title: 'name', media: 'mainPhoto' },
	},
});
