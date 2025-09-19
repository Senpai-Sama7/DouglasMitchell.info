import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'category', type: 'string' }),
    defineField({ name: 'abstract', type: 'text' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishDate', type: 'datetime' })
  ]
})
