export type Language = "Urdu" | "English";

export type CategorySlug =
  | "urdu"
  | "english"
  | "novels"
  | "self-help"
  | "fiction"
  | "poetry"
  | "history"
  | "business"
  | "islamic"
  | "biography";

export type Author = {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string;
  bio: string;
  location: string;
  bookCount: number;
  coverTone: string;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  authorId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  language: Language;
  categorySlugs: CategorySlug[];
  isbn: string;
  publisher: string;
  pages: number;
  edition: string;
  year: number;
  format: "Paperback" | "Hardcover";
  description: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  coverTone: string;
  accent: string;
};

export type Review = {
  id: string;
  bookId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  city: string;
};

export type CartItem = {
  bookId: string;
  quantity: number;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
};

export type User = {
  name: string;
  email: string;
};

export type PaymentMethod = "cod" | "online";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: string;
  paymentMethod: PaymentMethod;
  status: "Processing" | "Packed" | "Shipped" | "Delivered";
  address: Address;
};

export type Coupon = {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
};
