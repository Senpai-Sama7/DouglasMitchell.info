import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'liveEvent',
  title: 'Live Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'startTime', type: 'datetime' }),
    defineField({ name: 'endTime', type: 'datetime' }),
    defineField({ name: 'media', type: 'reference', to: [{ type: 'mediaItem' }] }),
    defineField({ name: 'description', type: 'text' })
  ]
})
