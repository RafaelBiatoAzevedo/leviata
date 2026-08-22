import { PersonCategory } from "../../../types/TPersonCategory";
import type { PersonFormData } from "../../../validations/person.schema";

export const personDefaultValues: PersonFormData = {
  name: "",

  category: PersonCategory.PESQUISADOR,

  isActive: true,

  displayOrder: 4,

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
