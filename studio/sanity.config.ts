import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Vvook management',

  projectId: 'sysdxpdd',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage Settings')
              .id('homepageSettings')
              .child(
                S.document()
                  .schemaType('homepageSettings')
                  .documentId('homepageSettings')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'homepageSettings'
            ),
          ]),
    }),
    visionTool(),
  ],

  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== 'homepageSettings'),
      actions: (prev, { schemaType }) =>
        schemaType === 'homepageSettings'
          ? prev.filter(({ action }) =>
            !action || !['delete', 'duplicate', 'unpublish'].includes(action)
          )
      : prev,
  },

  schema: {
    types: schemaTypes,
  },
})
