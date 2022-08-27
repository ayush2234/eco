import { Pageable } from 'app/layout/common/grid/grid.types';

export interface CompanyListResponse extends Pageable {
  companies: Company[];
}

export interface Company {
  company_id: string;
  company_name: string;
  note: string;
  referrer: string;
  is_active: string;
  allow_beta: string;
  limits: any[];
  restricted_to_sources: string[];
  restricted_to_integrations: string[];
}

export interface Limit {
  limit: number;
  used: number;
}
