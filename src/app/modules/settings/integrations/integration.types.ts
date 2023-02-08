export interface IntegrationSettingResponse {
  integrations: IntegrationSettings[];
}

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
  is_beta: string;
  integration_id?: string;
  force_test_connection: string;
  source_id: string;
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
  endpoints?: any[];
  connection: Connection;
  sync_options: SyncOption[];
  integration_instance_id?: string;
}

export interface Connection {
  label: string;
  code: string;
  description: string;
  fields: ConnectionField[];
  connection_instructions: string;
}

export interface ConnectionField extends Options {
  type: string;
  value: string;
  placeHolder?: string;
}

export interface SelectOption {
  option: string;
  label: string;
  isDefault: boolean;
}

export interface Options {
  code: string;
  label: string;
}

export interface MappedIntegration {
  integration_id?: string;
  source_id?: string;
  name?: string;
  icon?: string;
  description?: string;
  is_custom?: string;
  is_beta?: string;
  active_status?: string;
  force_test_connection?: string;
  json_form_schema_file?: string;
  installed_instances?: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  endpoints?: any[];
  connection?: Connection;
  sync_options?: MappedSyncOption[];
  integration_instance_id?: string;
  source_instance_id: string;
  connection_status?: boolean;
  last_connection_time: any
}

export interface MappedSyncOption {
  code: string;
  is_active: boolean;
  is_activated: boolean;
  is_custom?: boolean;
  sub_sync_options: MappedTab[];
}

export interface MappedTab {
  code: string;
  mapped_options: MappedOptions[];
}


export interface MappedOptions {
  mapped_code: string
  mapped_label: string
  mapped_type: string
  mapping_code: string
  mapping_type: string
  mapping_label: string
  mapping?: MappedOptions[]
}

export interface SyncOption extends Options {
  is_active: boolean;
  is_activated: boolean;
  description: string;
  sub_sync_options: Tab[];
}

export interface Tab extends Options {
  mapping_options: MappingOption[];
}

export interface MappingOption extends Options {
  type: VALUE_TYPE | any;
  required?: boolean;
  is_hidden?: boolean;
  display_conditions?: string;
  default_value?: string;
  value_options?: MappingValueOptions[] | any[];
  child_attribute_values?: any[];
  mapping_options?: MappingOption[] | any[];
  selected_value?: any;
  children?: MappingOption[];
  isHideEditAndDelete?: boolean; // Needed for show/hide edit and delete button, default is null/false
}

export interface MappingValueOptions {
  value_option_type: VALUE_OPTION_TYPE;
  values_list_origin: VALUE_LIST_ORIGIN;
  value_type: VALUE_TYPE;
  values_list?: string;
}

export interface MappedAttributeHeirarchy {
  values_list_origin: VALUE_LIST_ORIGIN;
  values_list: string;
  value_type?: VALUE_TYPE
}

export interface ValuesList extends Options {
  dynamic: boolean;
  values: ValuesListOptions[];
}

export interface ValuesListOptions extends Options { }
export interface IntegrationValue {
  source_instance_id: string;
  integration_id: string;
  name?: string;
  active_status: string,
  is_custom: string,
  connection_status: string,
  last_connection_time: "",
  connection?: any;
  sync_options: SyncOption[];
  integration_instance_id?: string;
}

export interface integrationInstanceConnection{
  store_url: string;
  consumer_key: string;
  consumer_secret: string;
}

export enum VALUE_OPTION_TYPE {
  values_list = 'values_list',
  text_input = 'text_input',
  decimal_input = 'decimal_input',
  categories = 'categories'
}

export enum VALUE_LIST_ORIGIN {
  source = 'source',
  channel = 'channel',
  global = 'global',
}

export enum VALUE_TYPE {
  static = 'static',
  option = 'option',
  attribute = 'attribute',
}
