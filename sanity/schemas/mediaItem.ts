import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
          { title: 'Document', value: 'document' },
          { title: 'Code Snippet', value: 'code' }
        ]
      }
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video'
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'audio'
    }),
    defineField({
      name: 'documentFile',
      title: 'Document File',
      type: 'file',
      hidden: ({ parent }) => parent?.mediaType !== 'document'
    }),
    defineField({
      name: 'codeSnippet',
      title: 'Code Snippet',
      type: 'code',
      hidden: ({ parent }) => parent?.mediaType !== 'code'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'mediaType'
    }
  }
})
