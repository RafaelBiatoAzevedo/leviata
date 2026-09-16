import type { ResearchInstrumentResponseDto } from "../dtos/researchInstruments/ResearchInstrumentResponseDto";
import type { ResearchInstrumentFormData } from "../validations/researchInstrument.schema";

export function mapResearchInstrumentToForm(
  instrument: ResearchInstrumentResponseDto,
): ResearchInstrumentFormData {
  return {
    title: instrument.title,
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
  return {
    title: data.title,
    type: data.type,
    startYear: data.startYear,
    endYear: data.endYear,
    content: data.content || undefined,
    externalUrl: data.externalUrl || undefined,
    people: data.people,
  };
}
