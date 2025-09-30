import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export async function getBlogPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readTime,
      featured,
      "category": category->title,
      "mainImage": mainImage{
        asset->{
          url
        }
      }
    }
  `)
}

export async function getBlogPost(slug: string) {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readTime,
      body,
      tags,
      "category": category->title,
      "mainImage": mainImage{
        asset->{
          url
        }
      },
      "mediaGallery": mediaGallery[]{
        _type == "image" => {
          asset->{
            url
          }
        },
        _type == "reference" => @->{
          title,
          mediaType,
          "image": image.asset->url,
          videoUrl,
          audioUrl
        }
      }
    }
  `, { slug })
}
