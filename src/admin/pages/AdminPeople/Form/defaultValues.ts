import { PersonCategory } from "../../../enums/person-category";
import type { PersonFormData } from "../../../validations/person.schema";

export const personDefaultValues: PersonFormData = {
  name: "",

  category: PersonCategory.PESQUISADOR,

  isActive: true,

  displayOrder: 0,

  imageUrl: "",

  birthDate: "",

  bio: "",

  orcid: "",

  email: "",

  lattesUrl: "",

  website: "",

  linkedinUrl: "",

  honorificTitle: "",

  nationalityId: "",

  academicTitleId: "",

  institutionId: "",
};
