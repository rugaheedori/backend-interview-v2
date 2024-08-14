export enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export enum SortType {
  like = 'like',
  review = 'review',
  newest = 'newest',
  min_price = 'min_price',
  max_price = 'max_price',
}

export class OrderOption {
  Like?: {
    _count: 'desc'; // 'Like'의 개수를 기준으로 내림차순 정렬합니다.
  };

  Review?: {
    _count: 'desc';
  };

  created_time?: 'desc';

  price?: 'asc' | 'desc';
}

export class FilterOption {
  brand?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  size?: Size;
  color?: string;
}

export class CursorOption {
  cursor?: {
    id: string;
  };
  skip?: number;
}

export class ProductInfo {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  size: Size;
  color: string;
}

export class ProductListInfo {
  id: string;
  name: string;
  price: number;
  size: Size;
  color: string;
  created_time: Date;
  _count: {
    Like: number;
    Review: number;
  };
}

export class ResProductList {
  id: string;
  name: string;
  price: number;
  size: Size;
  created_time: Date;
  like_count: number;
  review_count: number;
}
