import type {
  NewsletterContentDto,
  NewsletterContentItem,
  NewsletterContentSection,
} from "../dtos/newsletter/NewsletterContentDto";

export const newsletterTemplates = [
  {
    id: "CLASSIC",
    year: "2023",
    title: "Memória",
    description: "Retrospectivas, textos e a elegância do primeiro boletim.",
  },
  {
    id: "EDITORIAL",
    year: "2025",
    title: "Editorial",
    description: "Cabeçalho escuro, imagens e matérias em destaque.",
  },
  {
    id: "MAGAZINE",
    year: "2026",
    title: "Contemporâneo",
    description: "Marfim, moldura dourada e chamadas bem organizadas.",
  },
] as const;

export function newNewsletterItem(): NewsletterContentItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    text: "",
    details: "",
    imageUrl: "",
    imageAlt: "",
    linkUrl: "",
    linkLabel: "Saiba mais",
  };
}

export function newNewsletterSection(
  title = "Aconteceu",
  layout: "stories" | "briefs" = "stories",
): NewsletterContentSection {
  return {
    id: crypto.randomUUID(),
    title,
    layout,
    items: [newNewsletterItem()],
  };
}

export function defaultNewsletterContent(): NewsletterContentDto {
  return {
    version: 1,
    mode: "visual",
    template: "MAGAZINE",
    background: "paper",
    frame: "double",
    masthead: "Leviatã News",
    tagline: "Confira as últimas notícias do Grupo Leviatã e o Cativeiro!",
    editionLabel: "",
    intro: "",
    footer:
      "Grupo de Pesquisa Leviatã e o Cativeiro\nHistória, pesquisa e conhecimento em diálogo.",
    sections: [newNewsletterSection()],
  };
}

export function moveNewsletterEntry<T>(
  entries: T[],
  index: number,
  direction: -1 | 1,
): T[] {
  const target = index + direction;
  if (target < 0 || target >= entries.length) return entries;
  const result = [...entries];
  [result[index], result[target]] = [result[target], result[index]];
  return result;
}
