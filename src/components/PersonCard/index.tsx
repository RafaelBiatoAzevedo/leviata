import { useEffect, useId, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiHome,
  FiLinkedin,
} from "react-icons/fi";
import type { AcademicTitleResponseDto } from "../../admin/dtos/AcademicTitleResponseDto";
import type { InstitutionResponseDto } from "../../admin/dtos/InstitutionResponseDto";
import {
  personCategoryLabels,
  type TPersonCategory,
} from "../../admin/types/TPersonCategory";
import { timelineExternalUrl } from "../../utils/timeline";
import {
  Affiliation,
  Biography,
  BioToggle,
  CardFooter,
  CardHeader,
  Category,
  Container,
  Content,
  Description,
  Initials,
  Name,
  Ornament,
  ProfileImage,
  ProfileLink,
  SecondaryLink,
} from "./styles";

interface PersonCardProps {
  imageUrl?: string | null;
  name: string;
  academicTitle?: AcademicTitleResponseDto | null;
  showAcademicAbbreviation?: boolean;
  category?: TPersonCategory;
  institution?: InstitutionResponseDto | null;
  bio?: string | null;
  lattesUrl?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  orcid?: string | null;
  honorificTitle?: string | null;
}

export function PersonCard({
  imageUrl,
  name,
  academicTitle,
  showAcademicAbbreviation = true,
  institution,
  bio,
  category,
  lattesUrl,
  website,
  linkedinUrl,
  orcid,
  honorificTitle,
}: PersonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const bioId = useId();
  const nameId = useId();
  const cleanName = name.trim();
  const displayName = [
    honorificTitle?.trim(),
    showAcademicAbbreviation && academicTitle?.abbreviation?.trim(),
    cleanName,
  ]
    .filter(Boolean)
    .join(" ");
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initials = [words[0], words.length > 1 ? words[words.length - 1] : ""]
    .map((word) => Array.from(word || "")[0] || "")
    .join("")
    .toLocaleUpperCase("pt-BR");
  const categoryLabel = category && personCategoryLabels[category];
  const institutionName = institution?.name?.trim();
  const acronym = institution?.acronym?.trim();
  const biography = bio?.trim();
  const orcidValue = orcid?.trim();
  const links = [
    {
      label: "Currículo Lattes",
      url: lattesUrl,
      icon: <FiBookOpen aria-hidden="true" />,
    },
    { label: "Site", url: website, icon: <FiGlobe aria-hidden="true" /> },
    {
      label: "ORCID",
      url:
        orcidValue && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(orcidValue)
          ? `https://orcid.org/${orcidValue}`
          : orcidValue,
      icon: <span aria-hidden="true">iD</span>,
    },
    {
      label: "LinkedIn",
      url: linkedinUrl,
      icon: <FiLinkedin aria-hidden="true" />,
    },
  ].flatMap((link) => {
    const href = timelineExternalUrl(link.url);
    return href ? [{ ...link, href }] : [];
  });
  const [primaryLink, ...secondaryLinks] = links;

  useEffect(() => {
    const description = descriptionRef.current;
    if (!description || isExpanded) return;
    let active = true;
    const measure = () => {
      if (active)
        setIsOverflowing(
          description.scrollHeight > description.clientHeight + 1,
        );
    };
    const frame = requestAnimationFrame(measure);
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(description);
    if (!observer) window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", measure);
    };
  }, [biography, isExpanded]);

  if (!cleanName) return null;

  return (
    <Container aria-labelledby={nameId}>
      <CardHeader>
        <ProfileImage>
          <Initials aria-hidden="true">{initials}</Initials>
          {imageUrl && imageUrl !== failedImage && (
            <img
              src={imageUrl}
              alt={`Foto de ${cleanName}`}
              width={104}
              height={104}
              loading="lazy"
              decoding="async"
              onError={() => setFailedImage(imageUrl)}
            />
          )}
        </ProfileImage>
        <div>
          {categoryLabel && <Category>{categoryLabel}</Category>}
          <Ornament aria-hidden="true">❧</Ornament>
        </div>
      </CardHeader>
      <Content>
        <Name id={nameId}>{displayName}</Name>
        {(institutionName || acronym) && (
          <Affiliation>
            <FiHome aria-hidden="true" />
            <div>
              <strong>{acronym || institutionName}</strong>
              {institutionName && acronym && institutionName !== acronym && (
                <span>{institutionName}</span>
              )}
            </div>
          </Affiliation>
        )}
        {biography && (
          <Biography>
            <Description id={bioId} ref={descriptionRef} $expanded={isExpanded}>
              {biography}
            </Description>
            {isOverflowing && (
              <BioToggle
                type="button"
                aria-expanded={isExpanded}
                aria-controls={bioId}
                aria-label={`${isExpanded ? "Recolher biografia" : "Ver biografia completa"} de ${cleanName}`}
                onClick={() => setIsExpanded((value) => !value)}
              >
                {isExpanded ? "Recolher biografia" : "Ler biografia"}
                {isExpanded ? (
                  <FiChevronUp aria-hidden="true" />
                ) : (
                  <FiChevronDown aria-hidden="true" />
                )}
              </BioToggle>
            )}
          </Biography>
        )}
      </Content>
      {primaryLink && (
        <CardFooter>
          <ProfileLink
            href={primaryLink.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${primaryLink.label} de ${cleanName} em nova aba`}
          >
            {primaryLink.icon}
            <span>{primaryLink.label}</span>
            <FiArrowUpRight aria-hidden="true" />
          </ProfileLink>
          {secondaryLinks.map((link) => (
            <SecondaryLink
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              aria-label={`Abrir ${link.label} de ${cleanName} em nova aba`}
            >
              {link.icon}
            </SecondaryLink>
          ))}
        </CardFooter>
      )}
    </Container>
  );
}
