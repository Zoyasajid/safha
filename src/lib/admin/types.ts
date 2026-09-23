/**
 * Admin catalog types — independent of the storefront types so the shop UI
 * can stay unchanged. Map to a real DB later by swapping src/lib/admin/store.ts.
 */

export type AdminLanguage = "Urdu" | "English";
export type ProductStatus = "active" | "inactive" | "draft";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ReviewStatus = "pending" | "approved" | "hidden";
export type DiscountType = "percent" | "fixed";

export type AdminImage = {
  id: string;
  url: string;
  alt: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string;
  description: string;
  image?: string;
  parentId?: string | null;
  status: "active" | "inactive";
  createdAt: string;
};

export type AdminAuthor = {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string;
  bio: string;
  location: string;
  image?: string;
  coverTone: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  titleUrdu?: string;
  shortDescription: string;
  description: string;
  authorId: string;
  categoryIds: string[];
  subcategoryId?: string;
  language: AdminLanguage;
  bookType: string;
  publisher: string;
  isbn: string;
  edition: string;
  publicationDate: string;
  pages: number;
  price: number;
  salePrice?: number;
  costPrice: number;
  currency: "PKR";
  stock: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
  images: AdminImage[];
  coverTone: string;
  accent: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  deal: boolean;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  deliveryInfo: string;
  reviewsEnabled: boolean;
  showRating: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  status: "active" | "blocked";
};

export type AdminOrderItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
};

export type AdminOrder = {
  id: string;
  customerId: string;
  createdAt: string;
  items: AdminOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: string;
  paymentMethod: "cod" | "online";
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  address: {
    fullName: string;
    phone: string;
    line1: string;
    area: string;
    city: string;
    province: string;
    postalCode: string;
  };
};

export type AdminReview = {
  id: string;
  productId: string;
  customerId?: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  city: string;
  status: ReviewStatus;
};

export type AdminCoupon = {
  id: string;
  code: string;
  label: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
};

export type WishlistEntry = {
  id: string;
  customerId: string;
  productId: string;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  logoText: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  shippingInfo: string;
  returnPolicy: string;
  instagram: string;
  facebook: string;
  whatsappLink: string;
  cashOnDelivery: boolean;
  onlinePayments: boolean;
  jazzCash: boolean;
  easyPaisa: boolean;
  cards: boolean;
};

export type AdminDB = {
  products: AdminProduct[];
  categories: AdminCategory[];
  authors: AdminAuthor[];
  customers: AdminCustomer[];
  orders: AdminOrder[];
  reviews: AdminReview[];
  coupons: AdminCoupon[];
  wishlist: WishlistEntry[];
  settings: StoreSettings;
};

export function deriveStockStatus(p: Pick<AdminProduct, "stock" | "lowStockThreshold">): StockStatus {
  if (p.stock <= 0) return "out_of_stock";
  if (p.stock <= p.lowStockThreshold) return "low_stock";
  return "in_stock";
}
