export interface IntegrationSettings {
  instances: IntegrationInstance[];
  available: Integration[];
}

export interface IntegrationInstance {
  instance_id: string;
  integration: Integration;
  name: string;
  active_status: string;
  is_custom: string;
  pass_connection_test: string;
  created_at: string;
  updated_at: any;
}

export interface Integration {
  integration_id: string;
  source_id: string;
  name: string;
  icon: string;
  description: string;
  is_custom: string;
  is_beta: string;
  active_status: string;
  force_test_connection: string;
  json_form_schema_file: string;
  installed_instances: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface SyncOption {
  key: string;
  name: string;
  isActive: boolean;
  form: string;
  attributes: Attribute[];
}

export interface Attribute {
  setting: string;
  fieldType: string;
  erpValuesList: string;
  installationValuesList: string;
  additionalOptions: any;
  dependency?: string;
  source?: string;
  destination?: string;
}

export interface SelectOption {
  option: string;
  label: string;
  isDefault: boolean;
}
