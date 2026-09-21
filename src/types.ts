export enum GoodsField {
  /* Флаг состояния товара (в корзине / доступен). В данных всегда false */
  IsFlag = "B",
  /* Цена товара в долларах (USD). Требует перевода в рубли */
  PriceUsd = "C",
  /* ID группы товаров. Ссылка на ключ верхнего уровня в names.json */
  GroupId = "G",
  /* Количество единиц товара на складе. Выводится в скобках в названии */
  Stock = "P",
  /* ID товара. Ссылка на names.json */
  ProductId = "T",
}

/* Товар из data.json + вычисляемые поля из names.json */
export interface Good {
  [GoodsField.IsFlag]: boolean
  [GoodsField.PriceUsd]: number
  [GoodsField.GroupId]: number
  [GoodsField.Stock]: number
  [GoodsField.ProductId]: number | string

  // Название товара из names.json
  productName?: string
  // Куда изменилась цена в рублях при последнем тике
  direction?: PriceDirection

  // Название категории из names.json
  categoryName?: string
}

export type PriceDirection = 'up' | 'down' | 'same'

export interface ApiData {
  Error: string
  Id: number
  Success: boolean
  Value: { Goods: Good[] }
}

/* Справочник names.json */
export interface NameEntry { N: string; T: number | string }
export interface GroupEntry { G: string; C?: number; B: Record<string, NameEntry> }
export type NamesMap = Record<string, GroupEntry>

export interface Category {
  id: number
  name: string
  goods: Good[]
}

export interface CartItem {
  key: string
  good: Good
  quantity: number
}