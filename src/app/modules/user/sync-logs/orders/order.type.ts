import { Pageable } from 'app/layout/common/grid/grid.types';

export interface OrderListResponse extends Pageable {
  orders: OrdersList[];
}

export interface OrdersList {
  id: string;
  created_at: string;
  updated_at: string;
  integration_instance: Integration_instance;
  integration: Integration;
  log: Log;
  source: Source;
  channel: Channel;
  customer_name?: string;
  order_lines: OrderLines;
}

export interface OrderLines {
  id: number;
  sku: string;
  name?: string;
  quantity: number;
  shipping_service?: string;
  carrier?: string;
  carrier_tracking?: string;
  carrier_tracking_status?: string;
}
export interface History {
  id: number;
  created_at: string;
  result: string;
  message: string;
  errors: [];
  warnings: [];
}
export interface Integration_instance {
  id: string;
  name: string;
}
export interface Integration {
  id: string;
  name: string;
  logo: string;
}
export interface Log {
  status: string;
  action_required: boolean;
  lifecycle?: string;
  history: History[];
}
export interface Source {
  platform: string;
  order_id: string;
  status: string;
}
export interface Channel {
  platform: string;
  order_id: string;
  status: string;
}
