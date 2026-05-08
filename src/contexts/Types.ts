export interface ToastNotificationProps {
  [key: string]: unknown;
}

// export interface ProductsData {
//   id: string;
//   name: string;
//   price: number;
//   description?: string;
//   image: string;
//   originalPrice?: number;
//   discount?: string;
//   rating?: number;
//   totalPrice?: number;
//   quantity?: number;
//   totalQuantity?: number;
//   review?: number;
// }

export interface ProductsData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  
  // New Structured Fields
  introduction?: string;
  keyIngredients?: string;
  benefits?: string;
  howToUse?: string;

  rating?: number;
  reviewCount?: number; 
  reviews?: any[]

  totalPrice?: number;
  quantity?: number;
  totalQuantity?: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  country?: string;
  houseAddress?: string;
  streetName?: string;
  town?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}