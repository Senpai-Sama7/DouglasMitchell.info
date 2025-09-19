import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dailyDeck',
  title: 'Daily Deck',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slots',
      type: 'array',
      of: [
        defineField({
          name: 'slot',
          type: 'object',
          fields: [
            defineField({ name: 'component', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'reference', type: 'reference', to: [{ type: 'article' }, { type: 'mediaItem' }, { type: 'liveEvent' }, { type: 'game' }] }),
            defineField({ name: 'notes', type: 'text' })
          ]
        })
      ]
    })
  ]
})
