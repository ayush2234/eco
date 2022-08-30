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
}
