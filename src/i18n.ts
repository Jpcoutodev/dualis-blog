import { getCollection, type CollectionKey } from 'astro:content';

export type LangCode = 'pt-BR' | 'en' | 'es';

export interface LangDef {
	/** Código usado em <html lang> e hreflang. */
	code: LangCode;
	/** Rótulo curto no seletor de idioma. */
	label: string;
	/** Collection de conteúdo correspondente. */
	collection: CollectionKey;
	/** Prefixo de rota: '' para PT (raiz), 'en' e 'es' para os demais. */
	prefix: string;
	isDefault: boolean;
}

export const LANGUAGES: LangDef[] = [
	{ code: 'pt-BR', label: 'PT', collection: 'blog-pt', prefix: '', isDefault: true },
	{ code: 'en', label: 'EN', collection: 'blog-en', prefix: 'en', isDefault: false },
	{ code: 'es', label: 'ES', collection: 'blog-es', prefix: 'es', isDefault: false },
];

export const SITE = 'https://dualis.love';

// Strings de interface por idioma.
export interface UIStrings {
	siteTitle: string;
	siteDescription: string;
	blogTitle: string;
	allPosts: string;
	updatedOn: string;
	by: string;
	faqHeading: string;
	ctaTitle: string;
	ctaText: string;
	ctaButton: string;
	backToBlog: string;
	readMore: string;
	about: string;
	nav: { home: string; blog: string };
	footer: { terms: string; privacy: string; security: string; rights: string };
	aboutSlug: string;
}

export const UI: Record<LangCode, UIStrings> = {
	'pt-BR': {
		siteTitle: 'Blog Dualis',
		siteDescription:
			'Relacionamentos, fé e namoro cristão — conteúdo do Dualis, o app para cristãos solteiros.',
		blogTitle: 'Blog',
		allPosts: 'Todos os artigos',
		updatedOn: 'Atualizado em',
		by: 'Por',
		faqHeading: 'Perguntas frequentes',
		ctaTitle: 'Conheça alguém que compartilha da sua fé',
		ctaText:
			'O Dualis é o app de relacionamentos para cristãos solteiros. Baixe agora no Android e comece sua jornada.',
		ctaButton: 'Baixar na Google Play',
		backToBlog: '← Voltar ao blog',
		readMore: 'Ler mais',
		about: 'Sobre',
		nav: { home: 'Início', blog: 'Blog' },
		footer: {
			terms: 'Termos de Uso',
			privacy: 'Política de Privacidade',
			security: 'Segurança',
			rights: 'Todos os direitos reservados.',
		},
		aboutSlug: 'sobre',
	},
	en: {
		siteTitle: 'Dualis Blog',
		siteDescription:
			'Relationships, faith and Christian dating — from Dualis, the app for single Christians.',
		blogTitle: 'Blog',
		allPosts: 'All articles',
		updatedOn: 'Updated on',
		by: 'By',
		faqHeading: 'Frequently asked questions',
		ctaTitle: 'Meet someone who shares your faith',
		ctaText:
			'Dualis is the dating app for single Christians. Download it now on Android and start your journey.',
		ctaButton: 'Get it on Google Play',
		backToBlog: '← Back to the blog',
		readMore: 'Read more',
		about: 'About',
		nav: { home: 'Home', blog: 'Blog' },
		footer: {
			terms: 'Terms of Use',
			privacy: 'Privacy Policy',
			security: 'Safety',
			rights: 'All rights reserved.',
		},
		aboutSlug: 'about',
	},
	es: {
		siteTitle: 'Blog Dualis',
		siteDescription:
			'Relaciones, fe y citas cristianas — de Dualis, la app para cristianos solteros.',
		blogTitle: 'Blog',
		allPosts: 'Todos los artículos',
		updatedOn: 'Actualizado el',
		by: 'Por',
		faqHeading: 'Preguntas frecuentes',
		ctaTitle: 'Conoce a alguien que comparte tu fe',
		ctaText:
			'Dualis es la app de citas para cristianos solteros. Descárgala ahora en Android y comienza tu camino.',
		ctaButton: 'Descargar en Google Play',
		backToBlog: '← Volver al blog',
		readMore: 'Leer más',
		about: 'Acerca de',
		nav: { home: 'Inicio', blog: 'Blog' },
		footer: {
			terms: 'Términos de Uso',
			privacy: 'Política de Privacidad',
			security: 'Seguridad',
			rights: 'Todos los derechos reservados.',
		},
		aboutSlug: 'acerca',
	},
};

export function getLang(code: LangCode): LangDef {
	const lang = LANGUAGES.find((l) => l.code === code);
	if (!lang) throw new Error(`Idioma desconhecido: ${code}`);
	return lang;
}

/** Caminho da listagem do blog para um idioma. Ex.: '/blog', '/en/blog'. */
export function blogIndexPath(code: LangCode): string {
	const { prefix } = getLang(code);
	return prefix ? `/${prefix}/blog` : '/blog';
}

/** Caminho de um post. Ex.: '/blog/meu-post', '/en/blog/my-post'. */
export function postPath(code: LangCode, slug: string): string {
	return `${blogIndexPath(code)}/${slug}`;
}

/** URL absoluta de um post (para canonical/hreflang/sitemap). */
export function postUrl(code: LangCode, slug: string): string {
	return `${SITE}${postPath(code, slug)}`;
}

export interface Alternate {
	hreflang: string;
	href: string;
}

/**
 * Gera os links hreflang de um artigo cruzando as três collections pelo
 * campo `translationSlug`. Inclui x-default apontando para o PT.
 * Se não houver translationSlug, devolve apenas a própria URL.
 */
export async function getAlternates(
	currentCode: LangCode,
	currentSlug: string,
	translationSlug?: string,
): Promise<Alternate[]> {
	const alternates: Alternate[] = [];

	if (!translationSlug) {
		alternates.push({ hreflang: getLang(currentCode).code, href: postUrl(currentCode, currentSlug) });
		alternates.push({ hreflang: 'x-default', href: postUrl(currentCode, currentSlug) });
		return alternates;
	}

	let ptUrl: string | undefined;
	for (const lang of LANGUAGES) {
		const entries = await getCollection(lang.collection as 'blog-pt');
		const match = entries.find((e) => e.data.translationSlug === translationSlug);
		if (match) {
			const href = postUrl(lang.code, match.id);
			alternates.push({ hreflang: lang.code, href });
			if (lang.isDefault) ptUrl = href;
		}
	}

	// x-default aponta para o português (idioma principal do público).
	alternates.push({ hreflang: 'x-default', href: ptUrl ?? postUrl(currentCode, currentSlug) });
	return alternates;
}
