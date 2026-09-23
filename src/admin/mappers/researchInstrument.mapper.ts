import type { ResearchInstrumentResponseDto } from "../dtos/researchInstruments/ResearchInstrumentResponseDto";
import type { ResearchInstrumentFormData } from "../validations/researchInstrument.schema";

export function mapResearchInstrumentToForm(
  instrument: ResearchInstrumentResponseDto,
): ResearchInstrumentFormData {
  return {
    title: instrument.title,

    pdfUrl: instrument.pdfUrl ?? "",

    type: instrument.type,

    startYear: instrument.startYear ?? undefined,

    endYear: instrument.endYear ?? undefined,

    content: instrument.content ?? "",

    externalUrl: instrument.externalUrl ?? "",

    people: instrument.people.map((person) => person.id),
  };
}

export function mapResearchInstrumentToCreateDto(
  data: ResearchInstrumentFormData,
) {
  const dto = { ...data };

  delete (dto as Partial<ResearchInstrumentFormData & { pdfUrl: string }>)
    .pdfUrl;

  return dto;
}
