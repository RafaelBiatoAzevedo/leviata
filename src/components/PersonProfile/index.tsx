import { FiArrowUpRight, FiUser } from "react-icons/fi";
import type { PersonResponseDto } from "../../admin/dtos/people/PersonResponseDto";
import { personCategoryLabels } from "../../admin/types/TPersonCategory";
import { timelineExternalUrl } from "../../utils/timeline";
import { Avatar, Profile, ProfileHeader, ResourceLinks } from "./styles";

export function PersonProfile({
  person,
  showBio = true,
  showAcademicAbbreviation = true,
}: {
  person: Partial<PersonResponseDto>;
  showBio?: boolean;
  showAcademicAbbreviation?: boolean;
}) {
  const name = person.name?.trim();
  if (!name) return null;
  const orcid = person.orcid?.trim();
  const profileLinks = [
    { label: "Currículo Lattes", url: person.lattesUrl },
    { label: "Site", url: person.website },
    { label: "LinkedIn", url: person.linkedinUrl },
    {
      label: "ORCID",
      url:
        orcid && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(orcid)
          ? `https://orcid.org/${orcid}`
          : orcid,
    },
  ].flatMap((link) => {
    const href = timelineExternalUrl(link.url);
    return href ? [{ label: link.label, href }] : [];
  });

  return (
    <Profile>
      <ProfileHeader>
        <Avatar>
          <FiUser aria-hidden="true" />
          {person.imageUrl && (
            <img
              src={person.imageUrl}
              alt={`Foto de ${name}`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
            />
          )}
        </Avatar>
        <div>
          <h3>
            {[
              person.honorificTitle,
              showAcademicAbbreviation && person.academicTitle?.abbreviation,
              name,
            ]
              .filter(Boolean)
              .join(" ")}
          </h3>
          {person.academicTitle?.name && <p>{person.academicTitle.name}</p>}
          {person.institution?.name && (
            <p>
              {person.institution.name}
              {person.institution.acronym && ` (${person.institution.acronym})`}
            </p>
          )}
          {!person.institution?.name && person.institution?.acronym && (
            <p>{person.institution.acronym}</p>
          )}
          {person.category && (
            <small>{personCategoryLabels[person.category]}</small>
          )}
        </div>
      </ProfileHeader>
      {showBio && person.bio?.trim() && <p>{person.bio}</p>}
      {profileLinks.length > 0 && (
        <ResourceLinks>
          {profileLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <FiArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </ResourceLinks>
      )}
    </Profile>
  );
}
