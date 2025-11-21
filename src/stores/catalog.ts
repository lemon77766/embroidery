import { defineStore } from 'pinia'

export type CategoryKey = 'su' | 'xiang' | 'shu' | 'modern'
export type CategoryId = CategoryKey | 'all'

type BadgeVariant = 'new' | 'hot' | 'limited'

export interface Product {
  id: string
  title: string
  category: CategoryKey
  price: number
  rating: number
  reviews: number
  image: string
  badge?: {
    label: string
    variant: BadgeVariant
  }
}

export interface DisplayProduct extends Product {
  categoryLabel: string
}

const categoryLabels: Record<CategoryKey, string> = {
  su: '苏绣',
  xiang: '湘绣',
  shu: '蜀绣',
  modern: '现代刺绣'
}

const products: Product[] = [
  {
    id: 'flower-bird',
    title: '花鸟图',
    category: 'su',
    price: 2980,
    rating: 4.5,
    reviews: 28,
    image: '/images/jingxuan/huaniao.jpg',
    badge: { label: '新品', variant: 'new' }
  },
  {
    id: 'landscape',
    title: '山水图',
    category: 'shu',
    price: 3680,
    rating: 4.7,
    reviews: 42,
    image: '/images/jingxuan/shanshui.jpg',
    badge: { label: '热销', variant: 'hot' }
  },
  {
    id: 'figure',
    title: '人物图',
    category: 'xiang',
    price: 4280,
    rating: 4.6,
    reviews: 19,
    image: '/images/jingxuan/renwu.jpg'
  },
  {
    id: 'peony',
    title: '牡丹图',
    category: 'su',
    price: 3180,
    rating: 4.8,
    reviews: 35,
    image: '/images/jingxuan/mudan.jpg'
  },
  {
    id: 'screen',
    title: '羽锦刺绣',
    category: 'shu',
    price: 8680,
    rating: 4.9,
    reviews: 12,
    image: '/images/jingxuan/yumao.jpg',
    badge: { label: '限量', variant: 'limited' }
  },
  {
    id: 'modern-galaxy',
    title: '星河锦绣',
    category: 'modern',
    price: 2580,
    rating: 4.4,
    reviews: 17,
    image: '/images/jingxuan/xinghe.jpg',
    badge: { label: '当代', variant: 'new' }
  }
]

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [
      { id: 'all' as CategoryId, label: '全部' },
      { id: 'su' as CategoryId, label: '苏绣' },
      { id: 'xiang' as CategoryId, label: '湘绣' },
      { id: 'shu' as CategoryId, label: '蜀绣' },
      { id: 'modern' as CategoryId, label: '现代刺绣' }
    ],
    products,
    activeCategory: 'all' as CategoryId,
    searchQuery: ''
  }),
  getters: {
    filteredProducts(state): DisplayProduct[] {
      return state.products
        .map((product) => ({
          ...product,
          categoryLabel: categoryLabels[product.category]
        }))
        .filter((product) => {
          const matchCategory = state.activeCategory === 'all' || product.category === state.activeCategory
          const matchSearch =
            !state.searchQuery ||
            product.title.includes(state.searchQuery) ||
            product.categoryLabel.includes(state.searchQuery)

          return matchCategory && matchSearch
        })
    }
  },
  actions: {
    setCategory(category: CategoryId) {
      this.activeCategory = category
    },
    setSearchQuery(query: string) {
      this.searchQuery = query.trim()
    },
    clearSearch() {
      this.searchQuery = ''
    }
  }
})

