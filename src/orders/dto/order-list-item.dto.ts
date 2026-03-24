export interface OrderListItem {
  id: number;
  internal_number: number;
  company_name: string;
  sender_name: string | null;
  receiver_name: string | null;
  weight_kg: string;
  rate_per_kg: string;
  total_amount: string;
  prepaid_amount: string;
  extra_fee: string | null;
  status: string;
  created_at: Date;
}
