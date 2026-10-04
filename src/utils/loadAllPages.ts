export async function loadAllPages<T>(
  fetchPage: (params: {
    page: number;
    limit: number;
  }) => Promise<{ data: T[] }>,
): Promise<T[]> {
  const items: T[] = [];
  const limit = 100;
  for (let page = 1; ; page++) {
    const { data } = await fetchPage({ page, limit });
    items.push(...data);
    if (data.length < limit) return items;
  }
}
