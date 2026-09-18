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