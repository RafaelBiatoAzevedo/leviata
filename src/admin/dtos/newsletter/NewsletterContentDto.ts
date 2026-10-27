export interface NewsletterContentItem {
  id: string;
  title: string;
  text: string;
  details: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  linkLabel: string;
}

export interface NewsletterContentSection {
  id: string;
  title: string;
  layout: "stories" | "briefs";
  items: NewsletterContentItem[];
}

export interface NewsletterContentDto {
  customHtml?: string;
  version: 1;
  mode: "visual" | "html";
  template: "CLASSIC" | "EDITORIAL" | "MAGAZINE";
  background: "paper" | "white" | "ink";
  frame: "double" | "line" | "none";
  masthead: string;
  tagline: string;
  editionLabel: string;
  intro: string;
  footer: string;
  sections: NewsletterContentSection[];
}
