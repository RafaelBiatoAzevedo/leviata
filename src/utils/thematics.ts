export function thematicAcronym(title: string): string {
  return title
    .split(/\s+/)
    .filter(
      (word) =>
        word && !/^(e|a|o|as|os|de|da|do|das|dos|no|na|em)$/i.test(word),
    )
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
