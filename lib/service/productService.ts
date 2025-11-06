import { api } from '@/lib/axios';
import { SORT_OPTIONS, SortOptionKey } from '../utils/constant';

// Marketplace platforms
export type Platform = 'aliexpress' | 'taobao' | '1688';

// Error code mapping
export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  UPSTREAM_ERROR: 502,
  UPSTREAM_TIMEOUT: 504,
  UPSTREAM_NO_DATA: 'UPSTREAM_NO_DATA' as const
};

// Product and shop types
export interface Shop {
  name: string;
  id?: string;
}

export interface Price {
  value: string;
  currency: string;
}

export interface Product {
  currencySign: string | undefined;
  salesCount: number;
  productUrl: string | undefined;
  promotionPercent: null;
  platform: Platform;
  id: string;
  title: string;
  price?: Price;
  images?: string[];
  shop?: Shop;
  url?: string;
  attributes?: Record<string, any>;
  badge?: string;
  lastUpdated?: string;
  // Extended fields for search results
  currency?: string;
  totalSales?: number;
  itemUrl?: string;
  discount?: number | null;
  rating?: number;
  reviewCount?: number;
  itemId?: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOptionKey; // ✅ type-safe
  [key: string]: any;
}

export interface SearchResult {
  platform: Platform;
  products: Product[];
  badge?: string;
  nextPage?: number;
}

/**
 * Generate a simple hash from query parameters for analytics deduplication
 */
const generateQueryHash = (params: Record<string, any>): string => {
  const sortedParams = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  let hash = 5381;
  for (let i = 0; i < sortedParams.length; i++) {
    hash = ((hash << 5) + hash) + sortedParams.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
};

export const productService = {
  getProductById: async (platform: Platform, id: string): Promise<Product> => {
    const startTime = Date.now();
    try {
      const response = await api.get<Product>(`/${platform}/products/${id}`);
      const latencyMs = Date.now() - startTime;

      console.log('Product detail loaded:', {
        route: `/${platform}/products/${id}`,
        platform,
        id,
        status: response.status,
        latencyMs,
        fromCache: response.headers['x-from-cache'] === 'true',
        priceCurrency: response.data?.price?.currency
      });

      return response.data;
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      console.error('Product service error:', {
        route: `/${platform}/products/${id}`,
        platform,
        id,
        status: statusCode,
        latencyMs,
        errorCode: errorData?.code || 'UNKNOWN',
        provider: errorData?.provider
      });

      const enhancedError = new Error(errorData?.message || 'Failed to fetch product') as any;

      if (statusCode === 400) enhancedError.code = 'VALIDATION_ERROR';
      else if (statusCode === 404) enhancedError.code = 'NOT_FOUND';
      else if (statusCode === 502) enhancedError.code = 'UPSTREAM_ERROR';
      else if (statusCode === 504) enhancedError.code = 'UPSTREAM_TIMEOUT';
      else if (errorData?.code === 'UPSTREAM_NO_DATA') enhancedError.code = 'UPSTREAM_NO_DATA';
      else enhancedError.code = 'UNKNOWN';

      enhancedError.platform = platform;
      enhancedError.id = id;
      enhancedError.statusCode = statusCode;
      enhancedError.latencyMs = latencyMs;
      enhancedError.provider = errorData?.provider;

      throw enhancedError;
    }
  },

  searchProducts: async (
    marketplace: Platform = 'aliexpress',
    keyword: string,
    page: number = 1,
    filters: SearchFilters = {}
  ): Promise<SearchResult> => {
    const startTime = Date.now();

    try {
      const params: Record<string, any> = { keyword, page, ...filters };

      if (params.sort && typeof params.sort === 'string') {
        const sortKey = params.sort as SortOptionKey;
        params.sort = SORT_OPTIONS[sortKey] ?? 0;
      }

      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get<{
          badge: string | undefined; products: Product[]; meta?: any 
        }>(`/${marketplace}/search/simple`, { params });
      const latencyMs = Date.now() - startTime;

      const queryHash = generateQueryHash({ marketplace, keyword, page, ...filters });

      console.log('Search completed:', {
        route: `/${marketplace}/search/simple`,
        platform: marketplace,
        keyword,
        page,
        queryHash,
        status: response.status,
        latencyMs,
        resultCount: response.data?.products?.length || 0,
        fromCache: response.headers['x-from-cache'] === 'true'
      });

      const data = response.data;

      if (data?.products && Array.isArray(data.products)) {
        data.products = data.products.map(product => {
          const itemIdPrefix = product.itemId?.split('-')[0];
          let extractedPlatform: Platform = marketplace;

          if (itemIdPrefix === 'ae') extractedPlatform = 'aliexpress';
          else if (itemIdPrefix === 'tb') extractedPlatform = 'taobao';
          else if (itemIdPrefix === '1688') extractedPlatform = '1688';

          return {
            ...product,
            id: product.itemId || product.id,
            platform: extractedPlatform,
            currency: product.currencySign || product.currency || (marketplace === 'aliexpress' ? 'USD' : 'CNY'),
            totalSales: product.salesCount || 0,
            itemUrl: product.productUrl || product.itemUrl,
            discount: product.promotionPercent || null,
            rating: typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating,
            reviewCount: product.reviewCount || 0
          };
        });
      }

      return {
        platform: marketplace,
        products: data.products || [],
        badge: data?.badge,
        nextPage: data?.meta?.nextPage
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      const queryHash = generateQueryHash({ marketplace, keyword, page, ...filters });

      console.error('Search error:', {
        route: `/${marketplace}/search/simple`,
        platform: marketplace,
        keyword,
        page,
        queryHash,
        status: statusCode,
        latencyMs,
        errorCode: errorData?.code || 'UNKNOWN'
      });

      throw new Error(errorData?.message || 'Failed to search products');
    }
  }
};
