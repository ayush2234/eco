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
}

export interface Source {
  source_id: string;
  name: string;
  icon?: string;
  description: string;
  is_beta: string;
  is_installed: string;
  source_form: string;
  source_from: string;
  source_install_name?: string;
  source_instance_id?: string;
  active_status?: string;

  api_key?: string;
  account_id?: string;
  application_key?: string;
  access_token_secret?: any;
  access_token?: any;
  consumer_secret?: any;
  consumer_key?: any;
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
    | MarapostUpdateAttributes
    | SalsifyAttributes
    | MagentoAttributes
    | DearAttributes;
}

export class MarapostAttributes {
  storeUrl: string;
  username = 'wolfgroupdev';
  apiKey = 'key58de5de5eg5w5ww5g5c5egd';
}

export class MarapostUpdateAttributes {
  storeUrl: string;
  NETOAPI_USERNAME = 'wolfgroupdev';
  NETOAPI_KEY = 'key58de5de5eg5w5ww5g5c5egd';
}

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
  'maropostSource',
  'SalsifySource',
  'MagentoSource',
  'DearSource',
}
