// Unified data storage system for categories and products
// This ensures admin changes are reflected on user pages

export interface Category {
  id: string
  name: string
  nameEn: string
  nameZh: string
  productCount: number
  createdAt: string
  icon?: string
}

export interface Product {
  id: string
  title: string
  titleEn: string
  titleZh: string
  price: number
  originalPrice: number
  discount: number
  sold: number
  stock: number
  category: string
  image: string
  createdAt: string
}

// Storage keys
const CATEGORIES_KEY = "pandamall_categories"
const PRODUCTS_KEY = "pandamall_products"

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Thời trang",
    nameEn: "Fashion",
    nameZh: "服装服饰",
    productCount: 234,
    createdAt: "2024-01-15",
    icon: "👔",
  },
  {
    id: "2",
    name: "Mẹ và bé",
    nameEn: "Mother & Baby",
    nameZh: "母婴用品",
    productCount: 156,
    createdAt: "2024-01-16",
    icon: "👶",
  },
  {
    id: "3",
    name: "Phụ kiện điện tử",
    nameEn: "Electronics",
    nameZh: "电子配件",
    productCount: 189,
    createdAt: "2024-01-17",
    icon: "📱",
  },
  {
    id: "4",
    name: "Văn phòng phẩm",
    nameEn: "Office Supplies",
    nameZh: "办公文具",
    productCount: 145,
    createdAt: "2024-01-18",
    icon: "📝",
  },
  {
    id: "5",
    name: "Sức khỏe & Sắc đẹp",
    nameEn: "Health & Beauty",
    nameZh: "美容护理",
    productCount: 198,
    createdAt: "2024-01-19",
    icon: "💄",
  },
  {
    id: "6",
    name: "Điện gia dụng",
    nameEn: "Home Appliances",
    nameZh: "家用电器",
    productCount: 167,
    createdAt: "2024-01-20",
    icon: "🏠",
  },
  {
    id: "7",
    name: "Phụ kiện & trang trí",
    nameEn: "Accessories & Decor",
    nameZh: "汽车配件",
    productCount: 134,
    createdAt: "2024-01-21",
    icon: "🎨",
  },
  {
    id: "8",
    name: "Thể thao & dã ngoại",
    nameEn: "Sports & Outdoor",
    nameZh: "运动户外",
    productCount: 178,
    createdAt: "2024-01-22",
    icon: "⚽",
  },
  {
    id: "9",
    name: "Túi xách, vali",
    nameEn: "Bags & Luggage",
    nameZh: "箱包皮具",
    productCount: 156,
    createdAt: "2024-01-23",
    icon: "👜",
  },
]

// Default products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "123456789",
    title: "Áo polo nam cao cấp vải cotton thoáng mát phối sọc ngang thời trang",
    titleEn: "Men's Premium Cotton Polo Shirt with Horizontal Stripes",
    titleZh: "男士高级棉质Polo衫横条纹时尚款",
    price: 280081,
    originalPrice: 500000,
    discount: 58,
    sold: 23,
    stock: 150,
    category: "Fashion",
    image: "/men-polo-shirt-striped-green.jpg",
    createdAt: "2024-01-15",
  },
  {
    id: "111222333",
    title: "Áo Polo Nam Áo phông cộc tay trào lưu cổ bẻ mùa hè phong cách Hàn Quốc",
    titleEn: "Men's Summer Polo Shirt Korean Style Short Sleeve",
    titleZh: "男士夏季Polo衫韩版短袖翻领",
    price: 38000,
    originalPrice: 55000,
    discount: 31,
    sold: 17840,
    stock: 200,
    category: "Fashion",
    image: "/white-polo-shirt-gradient.jpg",
    createdAt: "2024-01-16",
  },
  {
    id: "nike001",
    title: "Giày bóng rổ cao cổ Nike Guan aj312 Giày nam Putian Giày thể thao nam",
    titleEn: "Nike High-Top Basketball Shoes AJ312 Men's Sports Sneakers",
    titleZh: "耐克高帮篮球鞋AJ312男士运动鞋",
    price: 160000,
    originalPrice: 380000,
    discount: 58,
    sold: 23,
    stock: 80,
    category: "Fashion",
    image: "/nike-shoe-gray-white.jpg",
    createdAt: "2024-01-17",
  },
]

// Category functions
export function getCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES

  const stored = localStorage.getItem(CATEGORIES_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("[v0] Error parsing categories:", e)
    }
  }

  // Initialize with default categories
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES))
  return DEFAULT_CATEGORIES
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  console.log("[v0] Categories saved to storage:", categories.length)
}

export function addCategory(category: Category): void {
  const categories = getCategories()
  categories.push(category)
  saveCategories(categories)
}

export function updateCategory(id: string, updates: Partial<Category>): void {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates }
    saveCategories(categories)
  }
}

export function deleteCategory(id: string): void {
  const categories = getCategories()
  const filtered = categories.filter((c) => c.id !== id)
  saveCategories(filtered)
}

// Product functions
export function getProducts(): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS

  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("[v0] Error parsing products:", e)
    }
  }

  // Initialize with default products
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS))
  return DEFAULT_PRODUCTS
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  console.log("[v0] Products saved to storage:", products.length)
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.push(product)
  saveProducts(products)
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    saveProducts(products)
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  saveProducts(filtered)
}

export function getProductById(id: string): Product | null {
  const products = getProducts()
  return products.find((p) => p.id === id) || null
}

export function getProductsByCategory(category: string): Product[] {
  const products = getProducts()
  return products.filter((p) => p.category === category)
}
