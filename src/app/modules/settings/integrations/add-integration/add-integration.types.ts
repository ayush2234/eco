export interface Integration {
  integrationId?: string;
  erpId?: string;
  name?: string;
  icon?: string;
  description?: string;
  isCustom?: boolean;
  connectionForm?: string;
  forceTestConnection?: boolean;
  endpoints?: any[];
  sync_options: SyncOption[];
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
  groupBy?: string;
}

export interface SelectOption {
  option: string;
  label: string;
  isDefault: boolean;
}

export enum VALUE_OPTION_TYPE {
  values_list = 'values_list',
  text_input = 'text_input',
  decimal_input = 'decimal_input',
  categories = 'categories',
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

export enum MAPPING_OPTIONS_TYPE {
  group = 'group',
  option = 'option',
  attribute = 'attribute',
  mapped_attribute = 'mapped_attribute',
  sync_option = 'sync_option'
}

export interface Options {
  code: string;
  label: string;
}

export interface SyncOption extends Options {
  type: MAPPING_OPTIONS_TYPE | any,
  isActive?: boolean;
  required?: boolean;
  description?: string;
  display_conditions?: string;
  default_value?: string;
  value_options?: MappingValueOptions[] | any[];
  mapped_attribute_heirarchy?: MappedAttributeHeirarchy[] | any[];
  mapping_options?: SyncOption[] | any[];
  selected_value?: any;
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