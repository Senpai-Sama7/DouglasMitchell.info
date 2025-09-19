import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'game',
  title: 'Interactive Module',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'component', type: 'string', description: 'React component identifier or embed URL' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'published', type: 'boolean', initialValue: false })
  ]
})
