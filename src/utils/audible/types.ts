import type { Author, Chapter, Genre, Narrator, Series } from 'types/book';

export interface AudibleChapter {
  length_ms: number;
  start_offset_ms: number;
  start_offset_sec: number;
  title: string;
}

export interface AudibleChapterInfo {
  brandIntroDurationMs: number;
  brandOutroDurationMs: number;
  chapters: AudibleChapter[];
  is_accurate: boolean;
  runtime_length_ms: number;
  runtime_length_sec: number;
}

export interface AudibleContentReference {
  acr: string;
  asin: string;
  content_format: string;
  content_size_in_bytes: number;
  file_version: string;
  marketplace: string;
  sku: string;
  tempo: string;
  version: string;
}

export interface AudibleContentMetadata {
  chapter_info: AudibleChapterInfo;
  content_reference: AudibleContentReference;
}

export const AUDIBLE_METADATA_RESPONSE_GROUPS = [
  'always-returned',
  'content_url',
  'chapter_info',
  'content_reference',
] as const;

export type AudibleMetadataResponseGroup =
  (typeof AUDIBLE_METADATA_RESPONSE_GROUPS)[number];

export interface AudibleMetadataResponse {
  content_metadata: AudibleContentMetadata;
  response_groups: AudibleMetadataResponseGroup[];
}

export const AUDIBLE_METADATA_DRM_TYPES = [
  'Mpeg',
  'PlayReady',
  'Hls',
  'Dash',
  'FairPlay',
  'Widevine',
  'HlsCmaf',
  'Adrm',
] as const;

export type AudibleMetadataDrmType =
  (typeof AUDIBLE_METADATA_DRM_TYPES)[number];

export const AUDIBLE_METADATA_QUALITIES = [
  'Low',
  'Normal',
  'High',
  'Extreme',
] as const;

export type AudibleMetadataQuality =
  (typeof AUDIBLE_METADATA_QUALITIES)[number];

export interface AudibleCodec {
  enhanced_codec: string;
  format: string;
  is_kindle_enhanced: boolean;
  name: string;
}

export interface GenreInterface {
  asin: string;
  name: string;
  type: string;
}

export interface AudibleRatingItem {
  average_rating: number;
  display_average_rating: string;
  display_stars: number;
  num_five_star_ratings: number;
  num_four_star_ratings: number;
  num_one_star_ratings: number;
  num_ratings: number;
  num_three_star_ratings: number;
  num_two_star_ratings: number;
}

export interface AudibleRating {
  num_reviews: number;
  overall_distribution: AudibleRatingItem;
  performance_distribution: AudibleRatingItem;
  story_distribution: AudibleRatingItem;
}

export interface AudibleAuthor {
  asin: string;
  name: string;
}

export interface AudibleNarrator {
  name: string;
}

export interface AudibleProductImages {
  500: string;
  1024?: string;
}

export interface AudibleSeries {
  asin: string;
  sequence: string;
  title: string;
  url: string;
}

export interface AudibleCategoryLadderItem {
  id: string;
  name: string;
}

export interface AudibleCategoryLadder {
  ladder: AudibleCategoryLadderItem[];
  root: string;
}

export type AudibleFormatType =
  | 'unabridged'
  | 'original_recording'
  | 'abridged';

export interface AudibleCustomerReview {
  asin: string;
  author_id: string;
  author_name: string;
  body: string;
  format: string;
  id: string;
  ratings: {
    overall_rating: number;
    performance_rating: number;
    story_rating: number;
  };
  review_content_scores: {
    content_quality: number;
    num_helpful_votes: number;
    num_unhelpful_votes: number;
  };
  /** ISO Date string */
  submission_date: string;
  title: string;
}

export interface AudiblePlan {
  /** ISO Date string */
  end_date: string;
  plan_name: string;
  /** ISO Date string */
  start_date: string;
}

export interface AudiblePriceItem {
  base: number;
  currency_code: string;
  merchant_id: string;
  type: string;
}

export interface AudiblePrice {
  credit_price: number;
  list_price: AudiblePriceItem;
  lowest_price: AudiblePriceItem;
}

export interface AudibleRelationship {
  asin: string;
  content_delivery_type: string;
  relationship_to_product: string;
  relationship_type: string;
  sequence: string;
  sku: string;
  sku_lite: string;
  sort: string;
  title: string;
  url: string;
}

export const AUDIBLE_CATALOG_RESPONSE_GROUPS = [
  'categories',
  'category_ladders',
  'claim_code_url',
  'contributors',
  'media',
  'price',
  'product_attrs',
  'product_desc',
  'product_extended_attrs',
  'product_plan_details',
  'product_plans',
  'provided_review',
  'rating',
  'relationships',
  'review_attrs',
  'reviews',
  'sample',
  'series',
  'sku',
  'ws4v',
] as const;

export type AudibleCatalogResponseGroup =
  (typeof AUDIBLE_CATALOG_RESPONSE_GROUPS)[number];

export interface AudibleProduct {
  asin: string;
  authors: AudibleAuthor[];
  available_codecs: AudibleCodec[];
  category_ladders: AudibleCategoryLadder[];
  content_delivery_type: string;
  content_type: string;
  customer_reviews: AudibleCustomerReview[];
  editorial_reviews: string[];
  format_type: AudibleFormatType;
  has_children: boolean;
  is_adult_product: boolean;
  is_listenable: boolean;
  is_purchasability_suppressed: boolean;
  is_ws4v_enabled: boolean;
  issue_date: string;
  language: string;
  merchandising_summary: string;
  narrators: AudibleNarrator[];
  plans: AudiblePlan[];
  price: AudiblePrice;
  product_images?: AudibleProductImages;
  publication_name: string;
  publisher_name: string;
  publisher_summary: string;
  rating: AudibleRating;
  relationships: AudibleRelationship[];
  release_date: string;
  runtime_length_min: number;
  sample_url: string;
  series: AudibleSeries[];
  sku: string;
  sku_lite: string;
  social_media_images?: {
    facebook?: string;
    twitter?: string;
  };
  thesaurus_subject_keywords: string[];
  title: string;
}

export interface AudibleCatalogItemResponse {
  product: AudibleProduct;
  response_groups: AudibleCatalogResponseGroup[];
}

export interface AudibleCatalogSearchResponse {
  product_filters: unknown[];
  products: AudibleProduct[];
  response_groups: AudibleCatalogResponseGroup[];
  total_results: number;
}

// Output Types
export interface ParsedCodec {
  codec: string;
  isKindleEnhanced: boolean;
  format: string;
  name: string;
  baseName?: string;
  sampleRate?: number;
  bitRate?: number;
}

export interface AudibleBook {
  chapters?: Chapter[];
  metadata?: AudibleContentMetadata;
  copyright?: string;
  copyrightYear?: string;
  asin: string;
  sku: string;
  url: string;
  title: string;
  description: string;
  largeCoverUrl: string;
  smallCoverUrl: string;
  datePublished: string;
  duration: number;
  rating: {
    ratingValue: number;
    ratingCount: number;
  };
  authors: Author[];
  narrators: Narrator[];
  series: Series[];
  genres: Genre[];
  publisher: string;
  isAbridged: boolean;
  language: string;
  codecs: ParsedCodec[];
}
