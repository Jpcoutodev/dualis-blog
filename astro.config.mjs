// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// NÃO usar `base` — o site é multi-idioma com rotas /blog, /en/blog e /es/blog.
// Um `base` global prefixaria tudo e quebraria as rotas EN/ES. As URLs nascem
// da estrutura de src/pages/. O sitemap é gerado por endpoint próprio
// (src/pages/blog/sitemap.xml.ts), por isso NÃO usamos @astrojs/sitemap.
// https://astro.build/config
export default defineConfig({
	site: 'https://dualis.love',
	trailingSlash: 'ignore',
	integrations: [mdx()],
	build: {
		format: 'directory',
	},
	fonts: [
		{
			// Mesma fonte do site principal (dualis.love) para identidade visual.
			provider: fontProviders.google(),
			name: 'Outfit',
			cssVariable: '--font-outfit',
			fallbacks: ['system-ui', 'sans-serif'],
			weights: [300, 400, 500, 600, 700, 800],
			styles: ['normal'],
			subsets: ['latin'],
		},
	],
});
