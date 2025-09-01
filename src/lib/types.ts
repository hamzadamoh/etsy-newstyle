export interface EtsyShop {
  shop_id: number;
  shop_name: string;
  listing_active_count: number;
  digital_listing_count: number;
  transaction_sold_count: number;
  num_favorers: number;
  icon_url_fullxfull: string | null;
  create_date: number;
  url: string;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  listing_type: string;
  num_favorers: number;
  views: number;
  original_creation_timestamp: number;
  last_modified_timestamp: number;
  quantity: number;
  tags: string[];
  url: string;
  image_url: string | null;
}

export interface Filters {
  favorites: number;
  age: number;
  views: number;
}
