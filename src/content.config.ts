import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schema compartilhado pelas três collections (uma por idioma).
// heroImage é uma STRING com caminho absoluto "/src/assets/blog/foto.jpg" — formato
// que o Sveltia CMS exige (public_folder começando com "/"). A otimização do <Image>
// é feita resolvendo essa string via import.meta.glob no helper src/heroImages.ts.
const postSchema = z.object({
	title: z.string(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: z.string().optional(),
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
