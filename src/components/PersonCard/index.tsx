import { useEffect, useId, useRef, useState } from "react";
import type { AcademicTitleResponseDto } from "../../admin/dtos/AcademicTitleResponseDto";
import type { InstitutionResponseDto } from "../../admin/dtos/InstitutionResponseDto";
import {
  personCategoryLabels,
  type TPersonCategory,
} from "../../admin/types/TPersonCategory";
import {
  Container,
  ProfileImage,
  Content,
  Name,
  Description,
  Category,
  Biography,
  BioToggle,
  ProfileLink,
} from "./styles";

interface PersonCardProps {
  imageUrl?: string;
  name: string;
  academicTitle?: AcademicTitleResponseDto | null;
  showAcademicAbbreviation?: boolean;
  category?: TPersonCategory;
  institution?: InstitutionResponseDto | null;
  bio?: string;
  lattesUrl?: string;
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
}: PersonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const bioId = useId();
  const displayName =
    `${showAcademicAbbreviation ? (academicTitle?.abbreviation ?? "") : ""} ${name}`.trim();

  useEffect(() => {
    const description = descriptionRef.current;

    if (!description || isExpanded) return;

    const observer = new ResizeObserver(() => {
      setIsOverflowing(description.scrollHeight > description.clientHeight);
    });

    observer.observe(description);

    return () => observer.disconnect();
  }, [bio, isExpanded]);

  return (
    <Container>
      {!!imageUrl && (
        <ProfileImage>
          <img src={imageUrl} alt={name} />
        </ProfileImage>
      )}

      <Content>
        <Name>
          {lattesUrl ? (
            <ProfileLink
              href={lattesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayName}
            </ProfileLink>
          ) : (
            displayName
          )}
        </Name>
        {category && <Category>{personCategoryLabels[category]}</Category>}

        {!!bio && (
          <Biography>
            <Description id={bioId} ref={descriptionRef} $expanded={isExpanded}>
              {bio}
            </Description>

            {isOverflowing && (
              <BioToggle
                type="button"
                aria-expanded={isExpanded}
                aria-controls={bioId}
                aria-label={
                  isExpanded
                    ? `Recolher biografia de ${name}`
                    : `Ver biografia completa de ${name}`
                }
                onClick={() => setIsExpanded((expanded) => !expanded)}
              >
                {isExpanded ? "Ver menos" : "Ver mais"}
              </BioToggle>
            )}
          </Biography>
        )}

        {!!institution?.acronym && <Category>{institution.acronym}</Category>}
      </Content>
    </Container>
  );
}
