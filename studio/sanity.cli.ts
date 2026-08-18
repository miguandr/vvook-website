import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'w0ka7cdd',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
	enabled: true,
	path: '../src/**/*.{ts,tsx}',
	schema: 'schema.json',
	generates: '../sanity.types.ts',
	overloadClientMethods: true,
  },
})

