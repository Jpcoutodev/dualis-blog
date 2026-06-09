import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LANGUAGES, postUrl, blogIndexPath, SITE, UI } from '../../i18n';

// Sitemap próprio sob /blog/ (não usamos @astrojs/sitemap — ver Etapa 7.1 da spec).
// Arquivo único, sem índice/filhos, com todas as URLs já em dualis.love — evita
// o problema de cross-domain no Search Console. Em build estático é pré-renderizado
// para dist/blog/sitemap.xml, exposto via rewrite em dualis.love/blog/sitemap.xml.
export const GET: APIRoute = async () => {
	const urls: { loc: string; lastmod?: string }[] = [];

	for (const lang of LANGUAGES) {
		// Listagem do idioma.
		urls.push({ loc: `${SITE}${blogIndexPath(lang.code)}` });
		// Página "Sobre" do idioma.
		urls.push({ loc: `${SITE}${blogIndexPath(lang.code)}/${UI[lang.code].aboutSlug}` });
		// Posts do idioma.
		const posts = await getCollection(lang.collection as 'blog-pt');
		for (const post of posts) {
			urls.push({
				loc: postUrl(lang.code, post.id),
				lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().split('T')[0],
			});
		}
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) =>
			`  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
