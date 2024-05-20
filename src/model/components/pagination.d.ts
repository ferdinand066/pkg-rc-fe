export type PaginationProps<T> = {
  current_page: number,
  from: number,
  data: T[],
  last_page: number,
  links: {
    active: boolean,
    label: string,
    url: string | null,
  }[],
  to: number,
  total: number,
  prev_page_url: string | null,
  next_page_url: string | null,
}