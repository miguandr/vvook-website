import { defineField, defineType } from "sanity";

export default defineType({
	name: 'talent',
	type: 'document',
	fields: [
		defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({ name: 'mainPhoto', type: 'image', validation: (Rule) => Rule.required() }),
		defineField({ name: 'gallery', type: 'array', of: [{ type: 'image'}] }),
		defineField({ name: 'height', type: 'number' }),
		defineField({ name: 'chest', type: 'number' }),
		defineField({ name: 'waist', type: 'number' }),
		defineField({ name: 'hips', type: 'number' }),
		defineField({ name: 'shoes', type: 'number' }),
		defineField({ name: 'suit', type: 'number' }),
		defineField({ name: 'dress', type: 'number' }),
	],
});

