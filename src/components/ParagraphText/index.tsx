import { FiArrowUpRight } from "react-icons/fi";
import { splitTextLinks } from "../../utils/textLinks";
import { Container, InlineLink, Paragraph } from "./styles.ts";

export function ParagraphText({
  text,
  linkifyUrls = false,
}: {
  text: string;
  linkifyUrls?: boolean;
}) {
  return (
    <Container>
      {text
        .replace(/\r\n/g, "\n")
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <Paragraph key={i}>
            {linkifyUrls
              ? splitTextLinks(p).map((part, index) =>
                  part.href ? (
                    <InlineLink
                      key={index}
                      href={part.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${part.text} (abre em nova aba)`}
                    >
                      {part.text}
                      <FiArrowUpRight aria-hidden="true" />
                    </InlineLink>
                  ) : (
                    part.text
                  ),
                )
              : p}
          </Paragraph>
        ))}
    </Container>
  );
}
