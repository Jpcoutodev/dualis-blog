import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema compartilhado pelas três collections (uma por idioma).
// É uma função porque usa o helper image() — assim o heroImage é otimizado
// automaticamente pelo <Image> do Astro (WebP/srcset). O CMS grava o caminho
// como "../../assets/blog/foto.webp" (public_folder relativo no config.yml),
// que é exatamente o formato que image() resolve.
const postSchema = ({ image }: { image: () => ReturnType<typeof z.string> }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.optional(image()),
		author: z.string().default('Equipe Dualis'),
		tags: z.array(z.string()).default([]),
		// Slug compartilhado entre os três idiomas do mesmo artigo (para hreflang).
		// Preencher sempre com o MESMO valor nas versões pt/en/es.
		translationSlug: z.string().optional(),
		// 3 a 5 perguntas/respostas para gerar JSON-LD FAQPage (otimização IA/SGE).
		faq: z
			.array(
				z.object({
					question: z.string(),
					answer: z.string(),
				}),
			)
			.optional(),
	});

const blogPt = defineCollection({
	loader: glob({ base: './src/content/blog-pt', pattern: '**/*.{md,mdx}' }),
	schema: postSchema,
});

const blogEn = defineCollection({
	loader: glob({ base: './src/content/blog-en', pattern: '**/*.{md,mdx}' }),
	schema: postSchema,
});

const blogEs = defineCollection({
	loader: glob({ base: './src/content/blog-es', pattern: '**/*.{md,mdx}' }),
	schema: postSchema,
});

export const collections = { 'blog-pt': blogPt, 'blog-en': blogEn, 'blog-es': blogEs };
