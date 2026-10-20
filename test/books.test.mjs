import { test } from "node:test";
import assert from "node:assert/strict";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormControl } from "react-hook-form";
import { bookSchema } from "../src/admin/validations/book.schema.ts";
import { mapBookToCreateDto } from "../src/admin/mappers/book.mapper.ts";
import { bookErrorDetails } from "../src/admin/utils/bookErrors.ts";

const valid = {
  title: "Livro de história",
  subtitle: "",
  description: "",
  isbn: "2233-332--322",
  year: 2024,
  publisher: "Editora",
  externalUrl: "https://example.org/livro",
  authors: ["550e8400-e29b-41d4-a716-446655440000"],
};

function form(values) {
  return createFormControl({
    defaultValues: values,
    resolver: zodResolver(bookSchema),
    shouldFocusError: false,
  });
}

test("keeps ISBN as text, including hyphens and leading zeroes", async () => {
  for (const isbn of ["2233-332--322", "0012-0334--555", ""]) {
    let submitted;
    const control = form({ ...valid, isbn });
    await control.handleSubmit((data) => {
      submitted = mapBookToCreateDto(data);
    })();
    assert.equal(submitted.isbn, isbn);
    assert.equal(typeof submitted.isbn, "string");
  }
});

test("rejects a numeric ISBN instead of silently converting it", () => {
  const result = bookSchema.safeParse({ ...valid, isbn: 2233332 });
  assert.equal(result.success, false);
  assert.ok(result.error.issues.some((issue) => issue.path[0] === "isbn"));
});

test("blocks blank and malformed links before submission and assigns an inline error", async () => {
  for (const externalUrl of ["", "  ", "link-invalido"]) {
    const control = form({ ...valid, externalUrl });
    let submissions = 0;
    await control.handleSubmit(() => submissions++)();
    assert.equal(submissions, 0);
    assert.match(control.getFieldState("externalUrl").error.message, /Informe/);
  }
});

test("exposes required-field and ISBN-length errors through react-hook-form", async () => {
  const control = form({
    ...valid,
    title: " ",
    publisher: "",
    year: Number.NaN,
    authors: [],
    isbn: "1".repeat(21),
  });
  let submissions = 0;
  await control.handleSubmit(() => submissions++)();
  assert.equal(submissions, 0);
  for (const field of ["title", "publisher", "year", "authors", "isbn"]) {
    assert.ok(control.getFieldState(field).error.message, `Missing ${field} error`);
  }
  assert.equal(
    control.getFieldState("isbn").error.message,
    "O ISBN deve ter no máximo 20 caracteres.",
  );
});

test("trims the URL while preserving the ISBN punctuation in the submitted DTO", () => {
  const data = bookSchema.parse({
    ...valid,
    externalUrl: ` ${valid.externalUrl} `,
    coverUrl: "https://example.org/capa.jpg",
  });
  const dto = mapBookToCreateDto(data);
  assert.equal(dto.externalUrl, valid.externalUrl);
  assert.equal(dto.isbn, valid.isbn);
  assert.equal(Object.hasOwn(dto, "coverUrl"), false);
});

test("maps API validation messages to fields, including per-author errors", () => {
  const messages = [
    "externalUrl must be a URL address",
    "isbn must be a string",
    "isbn must be shorter than or equal to 20 characters",
    "each value in authors must be a UUID",
  ];
  const details = bookErrorDetails({
    isAxiosError: true,
    response: { data: { message: messages } },
  });
  assert.equal(details.message, messages.join(" "));
  assert.deepEqual(details.fieldErrors, [
    { field: "externalUrl", message: messages[0] },
    { field: "isbn", message: messages.slice(1, 3).join(" ") },
    { field: "authors", message: messages[3] },
  ]);
});

test("keeps general API failures available for the error below the form", () => {
  const details = bookErrorDetails({
    isAxiosError: true,
    response: { data: { message: "Não foi possível enviar a capa." } },
  });
  assert.equal(details.message, "Não foi possível enviar a capa.");
  assert.deepEqual(details.fieldErrors, []);
  assert.equal(bookErrorDetails(new Error("Sem conexão")).message, "Sem conexão");
  assert.ok(bookErrorDetails(null).message);
});
