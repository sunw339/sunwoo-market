export class OrderItemDto {
  product_info_id: number;
  snapshot_price: number;
  amount: number;
}

export class CreateOrderDto {
  idempotency_key: string;
  total_price: number;
  items: OrderItemDto[];
}
