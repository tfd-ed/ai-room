import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asOgImageCollection } from 'nuxt-og-image/content'

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asOgImageCollection({
        type: 'page',
        source: '**/*.md',
        schema: z.object({
          author: z.string().optional(),
          avatar: z.string().optional(),
          date: z.string().optional(),
          updatedAt: z.string().optional(),
          updateSummary: z.string().optional(),
        }),
      }),
    ),
  },
})