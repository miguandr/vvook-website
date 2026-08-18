import { describe, it, expect, vi } from "vitest";
import { getTalents } from "./getTalents";

vi.mock('./client', () => ({
	client: {
		fetch: vi.fn().mockResolvedValue([{
			name: 'Max',
			mainPhoto: {
				_type: 'image',
				asset: { _type: 'reference', _ref: 'image-abc123-1502x2048-jpg' },
			}
		}]),
	},
}))

describe('getTalents', () => {
	it('returns the talents from Sanity', async () => {
		const talents = await getTalents()
		expect(talents).toEqual([{
			name: 'Max',
			mainPhoto: {
				_type: 'image',
				asset: { _type: 'reference', _ref: 'image-abc123-1502x2048-jpg' },
			}
		}])
	})
})
