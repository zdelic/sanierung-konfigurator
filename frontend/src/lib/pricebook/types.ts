export type PricebookItemDTO = {
  id: number;
  gewerk_key: string;
  position_key: string;
  title: string;
  description: string | null;
  unit: string | null;
  grundpreis: string | number;
  unitprice: string | number;
  is_active: boolean;
  sort: number;
  created_at: string | null;
  updated_at: string | null;
};

export type PricebookItemMap = Record<string, PricebookItemDTO>;
