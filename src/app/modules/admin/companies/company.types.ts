import { Pageable } from 'app/layout/common/grid/grid.types';

export interface CompanyListResponse extends Pageable {
  companies: Company[];
}

export interface Company {
  company_id: string;
  company_name: string;
  note: string;
  referrer: string;
  is_active: string | boolean;
  allow_beta: string | boolean;
  user_used: number;
  user_limit: number;
  source_used: number;
  source_limit: number;
  integration_used: number;
  integration_limit: number;
  sku_used: number;
  sku_limit: number;
  restricted_to_sources?: string[];
  restricted_to_integrations?: string[];
}
