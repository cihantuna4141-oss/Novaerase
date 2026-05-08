export interface ToastNotificationProps {
  [key: string]: unknown;
}

export interface Variant {
  id: string;
  penId: string;
  inkColor: string;
  tipSize: string;
  stock: number;
  price: number | string; // Allow price to be a number
}

export interface PenData {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: "Ballpoint" | "Fountain" | "Gel" | string; 
  images: string[];
  variants: Variant[]; // Array of variants included
}

// Type for creating a new Pen (omitting the auto-generated ID)
export type CreatePenInput = Omit<PenData, 'id' | 'variants'> & {
  variants?: Omit<Variant, 'id' | 'penId'>[];
};

// Type for updating a Pen (everything is optional except ID)
export type UpdatePenInput = Partial<CreatePenInput>;