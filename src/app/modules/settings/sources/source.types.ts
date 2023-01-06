import { SyncOption } from './add-source/add-source.types';

export interface SourceSettings {
  sources: Source[];
}

export interface Source {
  syncOptions: SyncOption[];
  instances: SourceInstance[];
  available: Source[];
}

export interface SourceInstance {
  source_instance_id: string;
  source_id: string;
  name: string;
  icon: string;
  description: string;
  active_status: string;
  pass_connection_test: string;
  is_beta: string;
  source_install_name: string;
  source_form: string;
  need_auth: boolean;
}

export interface Source {
  source_id: string;
  name: string;
  icon?: string;
  description: string;
  is_beta: string;
  is_installed: string;
  source_form: string;
  source_install_name?: string;
  source_instance_id?: string;
  active_status?: string;
}

export class SourcePayload {
  source_id: string;
  source_instance_id?: string;
  name: string;
  connectionPanel = new ConnectionPanel();
  active_status: 'Y' | 'N' | boolean;
}

export class ConnectionPanel {
  attributes:
    | MarapostAttributes
    // | MarapostUpdateAttributes
    | SalsifyAttributes
    | MagentoAttributes
    | DearAttributes
    | any;
}

export class MarapostAttributes {
  storeUrl: string;
  username?: string;
  apiKey?: string;
  NETOAPI_USERNAME?: string;
  NETOAPI_KEY?: string;
}

// export class MarapostUpdateAttributes {
//   storeUrl: string;
// }

export class SalsifyAttributes {
  api_key: string;
}

export class MagentoAttributes {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

export class DearAttributes {
  account_id: string;
  application_key: string;
}

export enum SourceFormEnum {
  'maropost',
  'salsify',
  'magento',
  'dearinventory',
  'shopify',
}
