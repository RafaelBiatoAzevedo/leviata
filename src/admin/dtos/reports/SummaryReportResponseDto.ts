export interface SummaryReportResponseDto {
  title: string;
  generatedAt: string;
  totalRecords: number;
  items: {
    key: string;
    label: string;
    total: number;
  }[];
}
