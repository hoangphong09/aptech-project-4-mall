// App info
export const APP_NAME = 'PandaMall';
export const API_TIMEOUT = 10000;

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

// Marketplaces
export const MARKETPLACES = {
  ALIEXPRESS: 'aliexpress',
  TAOBAO: 'taobao',
  MALL_1688: '1688',
} as const;

export type MarketplaceKey = keyof typeof MARKETPLACES;
export type MarketplaceValue = typeof MARKETPLACES[MarketplaceKey];

// Marketplace configuration
export interface MarketplaceConfig {
  label: string;
  color: string;
  textColor: string;
}

export const MARKETPLACE_CONFIG: Record<MarketplaceValue, MarketplaceConfig> = {
  [MARKETPLACES.ALIEXPRESS]: {
    label: 'AliExpress',
    color: 'bg-red-600',
    textColor: 'text-red-600',
  },
  [MARKETPLACES.TAOBAO]: {
    label: 'Taobao',
    color: 'bg-orange-600',
    textColor: 'text-orange-600',
  },
  [MARKETPLACES.MALL_1688]: {
    label: '1688',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
  },
};

// Default marketplace
export const DEFAULT_MARKETPLACE: MarketplaceValue = MARKETPLACES.ALIEXPRESS;

// Sort options mapping (frontend string to backend integer)
export const SORT_OPTIONS = {
  default: 0,
  'price-asc': 1,
  'price-desc': 2,
  sales: 3,
} as const;

export type SortOptionKey = keyof typeof SORT_OPTIONS;
export type SortOptionValue = typeof SORT_OPTIONS[SortOptionKey];

// Reverse mapping for display
export const SORT_LABELS: Record<SortOptionKey, string> = {
  default: 'Most Relevant',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  sales: 'Best Selling',
};
