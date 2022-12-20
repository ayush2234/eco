export interface SourceSettings {
  sources: Source[];
}

export interface Source {
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
  active_status?: string;
}

export class SourcePayload {
  source_id: string;
  name: string;
  connectionPanel = new ConnectionPanel();
  active_status: 'Y' | 'N';
}

export class ConnectionPanel {
  attributes = new Attributes();
}

export class Attributes {
  storeUrl: string;
  username = 'wolfgroupdev';
  apiKey = 'key58de5de5eg5w5ww5g5c5egd';
}
