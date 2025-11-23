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
  modern: '粤绣'
}

const products: Product[] = [
  {
    id: 'flower-bird',
    title: '花鸟刺绣',
    category: 'su',
    price: 2980,
    rating: 4.5,
    reviews: 28,
    image: '/images/jingxuan/huaniao.jpg',
    badge: { label: '新品', variant: 'new' }
  },
  {
    id: 'landscape',
    title: '山水锦绣',
    category: 'shu',
    price: 3680,
    rating: 4.7,
    reviews: 42,
    image: '/images/jingxuan/shanshui.jpg',
    badge: { label: '热销', variant: 'hot' }
  },
  {
    id: 'figure',
    title: '人物刺绣',
    category: 'xiang',
    price: 4280,
    rating: 4.6,
    reviews: 19,
    image: '/images/jingxuan/renwu.jpg'
  },
  {
    id: 'peony',
    title: '牡丹刺绣',
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
  },
  {
    id: 'double-sided-silk',
    title: '双面绣·春色满园',
    category: 'su',
    price: 5280,
    rating: 4.9,
    reviews: 56,
    image: '/images/zhonglei/1.jpg',
    badge: { label: '馆藏级', variant: 'limited' }
  },
  {
    id: 'lotus-dream',
    title: '荷塘月色刺绣屏风',
    category: 'su',
    price: 4680,
    rating: 4.8,
    reviews: 39,
    image: '/images/zhonglei/2.jpg'
  },
  {
    id: 'xiang-dragon-robe',
    title: '湘绣·瑞龙戏珠',
    category: 'xiang',
    price: 6880,
    rating: 4.9,
    reviews: 44,
    image: '/images/zhonglei/3.jpg',
    badge: { label: '热门', variant: 'hot' }
  },
  {
    id: 'phoenix-cloud',
    title: '凤凰云锦挂屏',
    category: 'xiang',
    price: 5380,
    rating: 4.7,
    reviews: 31,
    image: '/images/zhonglei/4.jpg'
  },
  {
    id: 'bamboo-forest',
    title: '蜀绣·四君子竹林',
    category: 'shu',
    price: 3980,
    rating: 4.6,
    reviews: 27,
    image: '/images/zhonglei/5.jpg'
  },
  {
    id: 'tea-mountain',
    title: '蜀绣·云岭茶山',
    category: 'shu',
    price: 4320,
    rating: 4.5,
    reviews: 22,
    image: '/images/zhonglei/6.jpg'
  },
  {
    id: 'modern-city-night',
    title: '当代·城市夜色',
    category: 'modern',
    price: 2980,
    rating: 4.4,
    reviews: 33,
    image: '/images/123.jpg',
    badge: { label: '当代', variant: 'new' }
  },
  {
    id: 'modern-ink-landscape',
    title: '当代·水墨山河',
    category: 'modern',
    price: 3520,
    rating: 4.7,
    reviews: 41,
    image: '/images/lishi/1.jpg'
  },
  {
    id: 'heritage-series-1',
    title: '非遗系列·云水谣',
    category: 'su',
    price: 4120,
    rating: 4.6,
    reviews: 29,
    image: '/images/lishi/2.jpg'
  },
  {
    id: 'heritage-series-2',
    title: '非遗系列·吉祥如意',
    category: 'xiang',
    price: 4360,
    rating: 4.8,
    reviews: 37,
    image: '/images/lishi/3.jpg'
  },
  {
    id: 'heritage-series-3',
    title: '非遗系列·锦绣山河',
    category: 'shu',
    price: 4580,
    rating: 4.9,
    reviews: 63,
    image: '/images/lishi/4.jpg',
    badge: { label: '经典', variant: 'hot' }
  },
  {
    id: 'heritage-series-4',
    title: '非遗系列·金缮花事',
    category: 'modern',
    price: 3860,
    rating: 4.5,
    reviews: 24,
    image: '/images/lishi/5.jpg'
  }
]

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [
      { id: 'all' as CategoryId, label: '全部' },
      { id: 'su' as CategoryId, label: '苏绣' },
      { id: 'xiang' as CategoryId, label: '湘绣' },
      { id: 'shu' as CategoryId, label: '蜀绣' },
      { id: 'modern' as CategoryId, label: '粤绣' }
    ],
    products,
    activeCategory: 'all' as CategoryId,
    searchQuery: ''
  }),
  getters: {
    allProducts(state): DisplayProduct[] {
      return state.products.map((product) => ({
        ...product,
        categoryLabel: categoryLabels[product.category]
      }))
    },
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

