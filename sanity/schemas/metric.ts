import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'metric',
  title: 'Metric',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'value', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'source', type: 'string' }),
    defineField({ name: 'display', type: 'boolean', initialValue: true })
  ]
})
