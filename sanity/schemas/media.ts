import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'muxAssetId', type: 'string', description: 'Mux asset ID for VOD playback' }),
    defineField({ name: 'muxPlaybackId', type: 'string', description: 'Mux playback ID for the player' }),
    defineField({ name: 'liveStreamId', type: 'string', description: 'Mux live stream identifier if applicable' }),
    defineField({ name: 'status', type: 'string', options: { list: ['draft', 'scheduled', 'published'] }, initialValue: 'draft' })
  ]
})
