export interface Pagination {
  length?: number;
  size?: number;
  page?: number;
  lastPage?: number;
  startIndex?: number;
  endIndex?: number;
}

export interface Tag {
  id?: string;
  title?: string;
  source_id?:string;
}

export interface Pageable {
 result_info: ResultInfo
}

export interface ResultInfo {
  total_records: number;
  total_pages: number;
  page_number: number;
  item_per_page: number;
}
