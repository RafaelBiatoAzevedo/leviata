import type { BookFormData } from "../../../validations/book.schema";

export const bookDefaultValues: BookFormData = {
  title: "",
  subtitle: "",
  description: "",
  isbn: "",
  year: 0,
  publisher: "",
  externalUrl: "",
  authors: [],
};
