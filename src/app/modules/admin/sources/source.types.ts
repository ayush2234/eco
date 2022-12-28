import { Pageable } from 'app/layout/common/grid/grid.types';

export interface SourceListResponse extends Pageable {
  sources: Source[];
}

export interface Source {
  source_id: string;
  name: string;
  icon?: string;
  description: string;
  is_custom: string | boolean;
  is_beta: string | boolean;
  active_status: string | boolean;
  source_form: string;
  force_connection_test: string | boolean;
  installed_instances: number;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  restricted_to_companies: string[];
}
