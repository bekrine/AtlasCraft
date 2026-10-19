export type Language = 'fr' | 'ar' | 'en';
export type Currency = 'MAD' | 'EUR' | 'USD';
export type ProductType = 'physical' | 'digital';

export interface LocalizedString {
  fr: string;
  ar: string;
  en: string;
}

export interface LocalizedStringList {
  fr: string[];
  ar: string[];
  en: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image?: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: LocalizedString;
  sku: string;
  priceAdjustmentMAD: number;
  stockQuantity: number;
}

export interface DigitalFileMeta {
  fileName: string;
  fileSize: string;
  fileFormat: string;
  version: string;
  licenseType: string;
  instructions: LocalizedString;
}

export interface Product {
  id: string;
  slug: string;
  type: ProductType;
  name: LocalizedString;
  description: LocalizedString;
  specifications: LocalizedStringList;
  basePriceMAD: number; // in Moroccan Dirhams
  salePriceMAD?: number;
  sku: string;
  categoryId: string;
  images: string[];
  stockQuantity: number;
  inStock: boolean;
  weightKg?: number;
  dimensions?: string;
  variants?: ProductVariant[];
  digitalFile?: DigitalFileMeta;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isNew?: boolean;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface DigitalEntitlement {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  token: string;
  fileFormat: string;
  fileSize: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'card_simulated' | 'bank_transfer';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  type: ProductType;
  quantity: number;
  unitPriceMAD: number;
  unitPriceCharged: number;
  variantName?: string;
  downloadToken?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  currency: Currency;
  exchangeRateToMAD: number;
  items: OrderItem[];
  subtotalCharged: number;
  shippingCharged: number;
  discountCharged: number;
  totalCharged: number;
  shippingAddress?: Address;
  shippingMethod?: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  couponCode?: string;
  notes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed_mad';
  amount: number;
  minOrderMAD?: number;
  validUntil: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Address[];
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  date: string;
  category: string;
  readTime: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  addressCity: string;
  addressCountry: string;
  freeShippingThresholdMAD: number;
  moroccoStandardShippingMAD: number;
  moroccoExpressShippingMAD: number;
  internationalStandardShippingMAD: number;
  internationalExpressShippingMAD: number;
  enableCod: boolean;
  enableCard: boolean;
  enableBankTransfer: boolean;
  announcementNotice: LocalizedString;
  announcementActive: boolean;
}
