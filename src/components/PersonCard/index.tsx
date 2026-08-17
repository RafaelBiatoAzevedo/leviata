import type { AcademicTitleResponseDto } from "../../admin/dto/AcademicTitleResponseDto";
import type { InstitutionResponseDto } from "../../admin/dto/InstitutionResponseDto";
import type { TPersonCategory } from "../../admin/enums/PersonCategory";
import {
  Container,
  ProfileImage,
  Content,
  Name,
  Description,
  Category,
} from "./styles";

interface PersonCardProps {
  imageUrl?: string;
  name: string;
  academicTitle?: AcademicTitleResponseDto;
  category: TPersonCategory;
  institution?: InstitutionResponseDto;
  bio?: string;
  lattesUrl?: string;
}

export function PersonCard({
  imageUrl,
  name,
  academicTitle,
  institution,
  bio,
  category,
  lattesUrl,
}: PersonCardProps) {
  return (
    <Container to={lattesUrl ? lattesUrl : ""} target="_blank">
      {!!imageUrl && (
        <ProfileImage>
          <img src={imageUrl} alt={name} />
        </ProfileImage>
      )}

      <Content>
        <Name>{`${academicTitle! ? academicTitle?.abbreviation : ""} ${name}`}</Name>
        <Category>{category}</Category>

        {!!bio && <Description>{bio}</Description>}

        {!!institution?.acronym && <Category>{institution.acronym}</Category>}
      </Content>
    </Container>
  );
}
