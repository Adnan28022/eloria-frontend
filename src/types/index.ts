export interface Product {
  id?: string;
  _id?: string;
  slug?: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  secondaryImage?: string;
  images?: string[];
  description?: string;
  benefits?: string[];
  ingredients?: string[];
  howToUse?: string;
  skinType?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  date: string;
  slug: string;
}

export interface User {
  name: string;
  email: string;
  addresses: string[];
}

export interface Bundle {
  id?: string;
  _id?: string;
  slug?: string;
  name: string;
  description?: string;
  image?: string;
  products?: Product[];
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  savings?: number;
}

export interface Order {
  id?: string;
  _id?: string;
  orderNumber: string;
  customer: User;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}