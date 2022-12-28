import { Pageable } from 'app/layout/common/grid/grid.types';

export interface IntegrationListResponse extends Pageable {
  integrations: Integration[];
}

export interface Integration {
  integration_id: string;
  source_id: string;
  name: string;
  icon: string;
  description: string;
  is_custom: string | boolean;
  is_beta: string | boolean;
  active_status: string | boolean;
  force_test_connection: string;
  json_form_schema_file: string;
  installed_instances: number;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  restricted_to_companies: string[];
}
