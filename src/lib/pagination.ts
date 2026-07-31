const DEFAULT_PAGE_SIZE = 10;

export type PageResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type PageSearchParams = { page?: string; size?: string };

/** The app UI always works with a 1-indexed page + size, regardless of how the backend paginates. */
export function parseUiPage(searchParams: PageSearchParams) {
  const page = Math.max(1, Math.trunc(Number(searchParams.page)) || 1);
  const size = Math.max(1, Math.trunc(Number(searchParams.size)) || DEFAULT_PAGE_SIZE);
  return { page, size };
}

/** Users list endpoint follows Spring Data pagination: 0-indexed `page` + `size`. */
export function toSpringParams(page: number, size: number) {
  return new URLSearchParams({ page: String(page - 1), size: String(size) });
}

/** Organizations/Companies list endpoints use `start` (offset) + `limit`. */
export function toStartLimitParams(page: number, size: number) {
  return new URLSearchParams({ start: String((page - 1) * size), limit: String(size) });
}

/**
 * Normalizes whatever shape the backend returns for a paginated list into a
 * consistent structure for the UI. Defensive by design since the exact
 * response shape for the `start`/`limit` endpoints wasn't specified.
 */
export function normalizePageResponse<T>(
  raw: unknown,
  uiPage: number,
  uiSize: number
): PageResult<T> {
  if (Array.isArray(raw)) {
    return { items: raw as T[], page: uiPage, size: uiSize, totalItems: raw.length, totalPages: 1 };
  }

  const obj = (raw ?? {}) as Record<string, unknown>;
  const itemsRaw = obj.content ?? obj.items ?? obj.data ?? obj.results ?? [];
  const items = Array.isArray(itemsRaw) ? (itemsRaw as T[]) : [];

  const totalItems = Number(obj.totalElements ?? obj.total ?? obj.totalItems ?? items.length);
  const totalPages = Number(
    obj.totalPages ?? (uiSize > 0 ? Math.max(1, Math.ceil(totalItems / uiSize)) : 1)
  );

  return {
    items,
    page: uiPage,
    size: uiSize,
    totalItems: Number.isFinite(totalItems) ? totalItems : items.length,
    totalPages: Number.isFinite(totalPages) ? totalPages : 1,
  };
}
