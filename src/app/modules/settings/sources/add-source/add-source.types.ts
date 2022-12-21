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
