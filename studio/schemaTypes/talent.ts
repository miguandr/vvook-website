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
			name: 'gallery',
			type: 'array',
			description: "Drag to reorder — the FIRST photo will be the grid photo.",
			of: [{
					type: 'image',
					options: { hotspot: true, metadata: ['lqip'] },
				}],
			options: { layout: 'grid' },
			validation: (Rule) => Rule.required().min(1)
		}),

		defineField({
			name: 'height',
			title: 'Height',
			type: 'number',
			description: 'In centimetres.',
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'chest',
			title: 'Chest',
			type: 'number',
			description: 'In centimetres.',
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'waist',
			title: 'Waist',
			type: 'number',
			description: 'In centimetres.',
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'hips',
			title: 'Hips',
			type: 'number',
			description: 'In centimetres.',
			validation: (Rule) => Rule.required()
		}),

		defineField({
			name: 'shoes',
			title: 'Shoes',
			type: 'number',
			description: 'EU size.',
			validation: (Rule) => Rule.required()
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
			description: 'The full link, e.g. https://instagram.com/username',
			validation: (Rule) => Rule.required()
		}),
	],
	preview: {
		select: { title: 'name', media: 'gallery.0' },
	},
});
