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

export interface Options {
    code: string;
    label: string;
}

export interface IntegrationSyncFormEndpoint {
    origin: string,
    type: string
}

export interface IntegrationSyncFormConnectionFields extends Options {
    type: string;
    needs_auth_url?: string;
    description: string;
}

export interface IntegrationSyncFormConnection extends Options {
    description: string,
    connection_instructions: string,
    fields: Array<IntegrationSyncFormConnectionFields>
}

export interface SyncOption extends Options {
    description: string;
    sub_sync_options: Tab[];
}

export interface Tab extends Options {
    mapping_options: MappingOption[] | any[];
}

export interface MappingOption extends Options {
    type: string | any;
    required?: boolean;
    description?: string;
    is_validated?: boolean;
    is_hidden?: boolean;
    display_conditions?: string;
    default_value?: string;
    value_options?: MappingValueOptions[] | any[];
    child_attribute_values?: any[];
    mapping_options?: MappingOption[] | any[];
    selected_value?: any;
    children?: MappingOption[];
}

export interface MappingValueOptions {
    value_option_type: string;
    values_list_origin: string;
    value_type: string;
    values_list?: string;
}

export interface ValuesList {
    source?: string[];
    channel?: string[];
    global?: string[];
    pim?: string[];
}

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
export interface IntegrationSyncForm {
    endpoints: Array<IntegrationSyncFormEndpoint>,
    connections: IntegrationSyncFormConnection,
    sync_options: SyncOption[]
}
