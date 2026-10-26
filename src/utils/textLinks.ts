export interface TextLinkPart {
  text: string;
  href?: string;
}

function trimUrlPunctuation(value: string): string {
  const pairs: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  const extraClosings: Record<string, number> = { ")": 0, "]": 0, "}": 0 };
  for (const character of value) {
    const closing = pairs[character];
    if (closing) extraClosings[closing] -= 1;
    else if (Object.hasOwn(extraClosings, character))
      extraClosings[character] += 1;
  }

  let end = value.length;
  while (end > 0) {
    const character = value[end - 1];
    if (/[.,;:!?…»”’]/u.test(character)) end -= 1;
    else if (extraClosings[character] > 0) {
      extraClosings[character] -= 1;
      end -= 1;
    } else break;
  }
  return value.slice(0, end);
}

export function splitTextLinks(text: string): TextLinkPart[] {
  const parts: TextLinkPart[] = [];
  let cursor = 0;
  for (const match of text.matchAll(/\bhttps?:\/\/[^\s<>"'`]+/giu)) {
    const href = trimUrlPunctuation(match[0]);
    try {
      const url = new URL(href);
      if (!url.hostname || !["http:", "https:"].includes(url.protocol))
        continue;
    } catch {
      continue;
    }
    if (match.index > cursor)
      parts.push({ text: text.slice(cursor, match.index) });
    parts.push({ text: href, href });
    cursor = match.index + href.length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}
