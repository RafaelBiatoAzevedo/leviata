import { Container, Paragraph } from "./styles.ts";

export function ParagraphText({ text }: { text: string }) {
  return (
    <Container>
      {text
        .replace(/\r\n/g, "\n")
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <Paragraph key={i}>{p}</Paragraph>
        ))}
    </Container>
  );
}
