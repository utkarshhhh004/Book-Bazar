
export interface BookQuery {
  search: string;
  condition: string;
  page: number;
  limit: number;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
}

export function parseBookQuery(query: Record<string, unknown>): BookQuery {
  const page = Math.max(1, Number(query.page) || 1);

  const limit = Math.min(
    50,
    Math.max(1, Number(query.limit) || 12)
  );

  const minPrice =
    query.minPrice !== undefined
      ? Number(query.minPrice)
      : undefined;

  const maxPrice =
    query.maxPrice !== undefined
      ? Number(query.maxPrice)
      : undefined;

  return {
    search: String(query.search || "").trim(),
    condition: String(query.condition || "").trim(),
    page,
    limit,
    sort: String(query.sort || "newest"),
    minPrice:
      minPrice !== undefined && Number.isFinite(minPrice)
        ? minPrice
        : undefined,
    maxPrice:
      maxPrice !== undefined && Number.isFinite(maxPrice)
        ? maxPrice
        : undefined,
  };
}
