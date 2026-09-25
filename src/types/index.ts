export type Language = "Urdu" | "English";

export type CategorySlug =
  | "urdu"
  | "english"
  | "novels"
  | "self-help"
  | "fiction"
  | "poetry"
  | "spiritual"
  | "personal-development"
  | "psychology"
  | "history"
  | "business"
  | "romance"
  | "islamic"
  | "mystery"
  | "thriller"
  | "biography";

export type Author = {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string;
  bio: string;
  location: string;
  bookCount: number;
  image?: string;
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
  format: "Paperback" | "Hardcover" | "2-Volume Set";
  description: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  coverImage?: string;
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

export type OnlinePaymentMethod = "jazzcash" | "easypaisa" | "card";

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
  onlinePaymentMethod?: OnlinePaymentMethod;
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
