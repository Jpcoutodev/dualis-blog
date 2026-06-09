import type { ImageMetadata } from 'astro';

// Mapeia o caminho absoluto gravado pelo CMS ("/src/assets/blog/foto.jpg") para
// o asset importado do Astro, permitindo otimização via <Image>. As chaves do
// import.meta.glob são exatamente caminhos absolutos a partir da raiz do projeto,
// então batem com o que o Sveltia grava no frontmatter (public_folder /src/assets/blog).
const images = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/blog/**/*.{jpeg,jpg,png,gif,webp,avif,svg}',
	{ eager: true },
);

export function resolveHero(path?: string): ImageMetadata | undefined {
	if (!path) return undefined;
	return images[path]?.default;
}
