interface PdfSize {
  width: number;
  height: number;
}

export function fitPdfPageWidth(bounds: PdfSize, page: PdfSize) {
  if (
    ![bounds.width, bounds.height, page.width, page.height].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  )
    return 1;
  return Math.max(
    1,
    Math.floor(
      Math.min(bounds.width, (bounds.height * page.width) / page.height),
    ),
  );
}
