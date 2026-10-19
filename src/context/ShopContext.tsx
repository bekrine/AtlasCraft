import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Language,
  Currency,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  User,
  EditorialArticle,
  StoreSettings,
} from '../types/ecommerce';
import { translations } from '../i18n/translations';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ARTICLES,
  INITIAL_STORE_SETTINGS,
  INITIAL_COUPONS,
} from '../data/mockData';

// Fixed conversion rates to MAD base (Moroccan Dirham)
export const EXCHANGE_RATES: Record<Currency, number> = {
  MAD: 1.0,
  EUR: 0.093, // 1 MAD = 0.093 EUR (~10.75 MAD = 1 EUR)
  USD: 0.10,  // 1 MAD = 0.10 USD (~10.00 MAD = 1 USD)
};

interface ShopContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (priceInMAD: number) => string;
  t: typeof translations.fr;
  
  // Navigation & Routing
  currentRoute: string;
  navigate: (route: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotalMAD: number;
  cartDiscountMAD: number;
  cartItemCount: number;
  hasPhysicalInCart: boolean;
  hasDigitalInCart: boolean;

  // Catalog
  products: Product[];
  categories: Category[];
  articles: EditorialArticle[];
  storeSettings: StoreSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
  selectedTypeFilter: 'all' | 'physical' | 'digital';
  setSelectedTypeFilter: (t: 'all' | 'physical' | 'digital') => void;
  selectedSort: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  setSelectedSort: (s: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;

  // User & Auth
  user: User | null;
  setUser: (u: User | null) => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
  logout: () => void;

  // Orders & Fulfillment
  orders: Order[];
  createOrder: (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress?: any;
    shippingMethod: string;
    shippingChargedMAD: number;
    paymentMethod: 'cod' | 'card_simulated' | 'bank_transfer';
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => void;

  // Admin Catalog Management
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStoreSettings: (settings: StoreSettings) => void;
  exportProductsCSV: () => string;
  importProductsCSV: (csvText: string) => { success: boolean; count: number; errors?: string[] };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language state with HTML dir sync
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('atlascraft_lang') as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('atlascraft_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  // 2. Currency state
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('atlascraft_curr') as Currency) || 'MAD';
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('atlascraft_curr', curr);
  };

  // 3. Price formatting helper with exact minor units and localized symbols
  const formatPrice = (priceInMAD: number): string => {
    const rate = EXCHANGE_RATES[currency];
    const converted = priceInMAD * rate;

    if (currency === 'MAD') {
      // In Morocco: "1 290 DH" or "1290 د.م"
      const formattedNumber = Math.round(converted).toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-MA');
      if (language === 'ar') return `${formattedNumber} د.م`;
      return `${formattedNumber} DH`;
    }

    if (currency === 'EUR') {
      return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(converted);
    }

    if (currency === 'USD') {
      return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(converted);
    }

    return `${converted.toFixed(2)} ${currency}`;
  };

  // Current translation strings
  const t = translations[language];

  // 4. Client route management
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Products, Categories, Settings, Articles
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atlascraft_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [articles] = useState<EditorialArticle[]>(INITIAL_ARTICLES);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('atlascraft_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STORE_SETTINGS;
  });

  // Sync products to localStorage
  useEffect(() => {
    localStorage.setItem('atlascraft_products', JSON.stringify(products));
  }, [products]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('atlascraft_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // 6. User and Authentication
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('atlascraft_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('atlascraft_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('atlascraft_user');
    }
  }, [user]);

  const loginAsDemoAdmin = () => {
    setUser({
      id: 'usr_admin_1',
      name: 'Youssef El Amrani',
      email: 'admin@atlascraft.ma',
      role: 'admin',
      phone: '+212 6 61 23 45 67',
      addresses: [],
    });
  };

  const loginAsDemoCustomer = () => {
    setUser({
      id: 'usr_cust_1',
      name: 'Kenza Benjelloun',
      email: 'kenza.b@example.com',
      role: 'customer',
      phone: '+212 6 65 99 88 77',
      addresses: [
        {
          fullName: 'Kenza Benjelloun',
          line1: '14 Boulevard d’Anfa, Apt 5',
          city: 'Casablanca',
          postalCode: '20000',
          country: 'Maroc',
          phone: '+212 6 65 99 88 77',
        },
      ],
    });
  };

  const logout = () => {
    setUser(null);
  };

  // 7. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atlascraft_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem('atlascraft_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string, variantId?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { productId, variantId, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, quantity: number = 1) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === clean && c.active);
    if (!found) {
      return { success: false, message: t.invalidCoupon };
    }
    setAppliedCoupon(found);
    return { success: true, message: t.couponApplied };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart calculations in MAD
  const { cartSubtotalMAD, cartDiscountMAD, cartItemCount, hasPhysicalInCart, hasDigitalInCart } =
    useMemo(() => {
      let subtotal = 0;
      let count = 0;
      let physical = false;
      let digital = false;

      for (const item of cart) {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod) continue;
        let price = prod.salePriceMAD ?? prod.basePriceMAD;
        if (item.variantId && prod.variants) {
          const v = prod.variants.find((vr) => vr.id === item.variantId);
          if (v) price += v.priceAdjustmentMAD;
        }
        subtotal += price * item.quantity;
        count += item.quantity;
        if (prod.type === 'physical') physical = true;
        if (prod.type === 'digital') digital = true;
      }

      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.discountType === 'percentage') {
          discount = Math.round((subtotal * appliedCoupon.amount) / 100);
        } else if (appliedCoupon.discountType === 'fixed_mad') {
          discount = Math.min(subtotal, appliedCoupon.amount);
        }
      }

      return {
        cartSubtotalMAD: subtotal,
        cartDiscountMAD: discount,
        cartItemCount: count,
        hasPhysicalInCart: physical,
        hasDigitalInCart: digital,
      };
    }, [cart, products, appliedCoupon]);

  // 8. Orders History & Management
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atlascraft_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial demo order for seed tracking
    return [
      {
        id: 'ord_1001',
        orderNumber: 'AC-1001',
        customerName: 'Samir Mansouri',
        customerEmail: 'samir.m@example.ma',
        customerPhone: '+212 6 61 12 34 56',
        createdAt: '2026-03-24T10:15:00Z',
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'cod',
        currency: 'MAD',
        exchangeRateToMAD: 1.0,
        subtotalCharged: 1290,
        shippingCharged: 0,
        discountCharged: 0,
        totalCharged: 1290,
        shippingCarrier: 'Amana Express',
        trackingNumber: 'MA849204928',
        shippingAddress: {
          fullName: 'Samir Mansouri',
          line1: 'Avenue Mohammed V, Résidence Al Amal',
          city: 'Rabat',
          postalCode: '10000',
          country: 'Maroc',
          phone: '+212 6 61 12 34 56',
        },
        items: [
          {
            productId: 'prod_1',
            productName: 'Sac Weekender Cuir Pleine Fleur Caravane',
            sku: 'LEA-WKD-001',
            type: 'physical',
            quantity: 1,
            unitPriceMAD: 1290,
            unitPriceCharged: 1290,
            variantName: 'Caramel Fauve',
          },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('atlascraft_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderPayload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress?: any;
    shippingMethod: string;
    shippingChargedMAD: number;
    paymentMethod: 'cod' | 'card_simulated' | 'bank_transfer';
  }): Order => {
    const orderNumber = `AC-${Math.floor(100000 + Math.random() * 900000)}`;
    const rate = EXCHANGE_RATES[currency];

    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      let price = prod.salePriceMAD ?? prod.basePriceMAD;
      let variantName: string | undefined;
      if (item.variantId && prod.variants) {
        const v = prod.variants.find((vr) => vr.id === item.variantId);
        if (v) {
          price += v.priceAdjustmentMAD;
          variantName = v.name[language] || v.name.fr;
        }
      }
      return {
        productId: prod.id,
        productName: prod.name[language] || prod.name.fr,
        sku: prod.sku,
        type: prod.type,
        quantity: item.quantity,
        unitPriceMAD: price,
        unitPriceCharged: Math.round(price * rate * 100) / 100,
        variantName,
        downloadToken:
          prod.type === 'digital'
            ? `dl_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`
            : undefined,
      };
    });

    const subtotalCharged = Math.round(cartSubtotalMAD * rate * 100) / 100;
    const shippingCharged = Math.round(orderPayload.shippingChargedMAD * rate * 100) / 100;
    const discountCharged = Math.round(cartDiscountMAD * rate * 100) / 100;
    const totalCharged = Math.max(0, subtotalCharged + shippingCharged - discountCharged);

    const isPaidInstantly = orderPayload.paymentMethod === 'card_simulated';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerId: user?.id,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      createdAt: new Date().toISOString(),
      status: isPaidInstantly ? 'processing' : 'pending',
      paymentStatus: isPaidInstantly ? 'paid' : 'pending',
      paymentMethod: orderPayload.paymentMethod,
      currency,
      exchangeRateToMAD: rate,
      items: orderItems,
      subtotalCharged,
      shippingCharged,
      discountCharged,
      totalCharged,
      shippingAddress: orderPayload.shippingAddress,
      shippingMethod: orderPayload.shippingMethod,
      couponCode: appliedCoupon?.code,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update physical product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const bought = cart.find((c) => c.productId === prod.id);
        if (bought && prod.type === 'physical') {
          const newStock = Math.max(0, prod.stockQuantity - bought.quantity);
          return {
            ...prod,
            stockQuantity: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      })
    );

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingNumber: trackingNumber ?? ord.trackingNumber,
            shippingCarrier: carrier ?? ord.shippingCarrier,
            paymentStatus:
              status === 'delivered' && ord.paymentMethod === 'cod'
                ? 'paid'
                : status === 'refunded'
                ? 'refunded'
                : ord.paymentStatus,
          };
        }
        return ord;
      })
    );
  };

  // 9. Admin Catalog Actions
  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
  };

  const exportProductsCSV = (): string => {
    const headers = [
      'ID',
      'SKU',
      'Type',
      'Category',
      'Name_FR',
      'Name_AR',
      'Name_EN',
      'BasePriceMAD',
      'SalePriceMAD',
      'Stock',
      'WeightKg',
    ];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.sku}"`,
      `"${p.type}"`,
      `"${p.categoryId}"`,
      `"${p.name.fr.replace(/"/g, '""')}"`,
      `"${p.name.ar.replace(/"/g, '""')}"`,
      `"${p.name.en.replace(/"/g, '""')}"`,
      p.basePriceMAD,
      p.salePriceMAD || '',
      p.stockQuantity,
      p.weightKg || '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const importProductsCSV = (csvText: string): { success: boolean; count: number; errors?: string[] } => {
    try {
      const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, count: 0, errors: ['CSV file is empty or missing headers'] };
      }
      let importedCount = 0;
      const updatedProducts = [...products];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 7) {
          const sku = cols[1];
          const type = (cols[2] as 'physical' | 'digital') || 'physical';
          const cat = cols[3] || 'cat_leather';
          const nameFr = cols[4];
          const nameAr = cols[5] || cols[4];
          const nameEn = cols[6] || cols[4];
          const price = parseFloat(cols[7]) || 100;
          const stock = parseInt(cols[9], 10) || 10;

          const existingIdx = updatedProducts.findIndex((p) => p.sku === sku);
          const newOrUpdated: Product = {
            id: existingIdx > -1 ? updatedProducts[existingIdx].id : `prod_csv_${Date.now()}_${i}`,
            slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            sku,
            type,
            categoryId: cat,
            name: { fr: nameFr, ar: nameAr, en: nameEn },
            description: {
              fr: `Produit importé: ${nameFr}`,
              ar: `منتج مستورد: ${nameAr}`,
              en: `Imported item: ${nameEn}`,
            },
            specifications: {
              fr: ['Produit artisanal certifié'],
              ar: ['منتج أصيل معتمد'],
              en: ['Certified authentic craft'],
            },
            basePriceMAD: price,
            stockQuantity: stock,
            inStock: stock > 0,
            images: ['/src/assets/images/hero_moroccan_craft_1792442852128.jpg'],
            rating: 5.0,
            reviewCount: 1,
          };

          if (existingIdx > -1) {
            updatedProducts[existingIdx] = { ...updatedProducts[existingIdx], ...newOrUpdated };
          } else {
            updatedProducts.push(newOrUpdated);
          }
          importedCount++;
        }
      }

      setProducts(updatedProducts);
      return { success: true, count: importedCount };
    } catch (err: any) {
      return { success: false, count: 0, errors: [err?.message || 'Failed to parse CSV'] };
    }
  };

  // 10. Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        formatPrice,
        t,
        currentRoute,
        navigate,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotalMAD,
        cartDiscountMAD,
        cartItemCount,
        hasPhysicalInCart,
        hasDigitalInCart,
        products,
        categories,
        articles,
        storeSettings,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedTypeFilter,
        setSelectedTypeFilter,
        selectedSort,
        setSelectedSort,
        user,
        setUser,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
        logout,
        orders,
        createOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        updateStoreSettings,
        exportProductsCSV,
        importProductsCSV,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
