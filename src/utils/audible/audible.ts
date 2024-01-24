/* eslint-disable prefer-destructuring */
import type { Author, Chapter, Genre, Series } from 'types/book';
import type { CountryAlpha2 } from 'utils/countries';
import { cleanDescription, cleanSeriesTitle, cleanTitle } from 'utils/string';
import { isValidUrl } from 'utils/url';
import { parseAudibleChapters } from './chapters';
import {
  AUDIBLE_CATALOG_RESPONSE_GROUPS,
  AUDIBLE_METADATA_DRM_TYPES,
  AUDIBLE_METADATA_QUALITIES,
  AUDIBLE_METADATA_RESPONSE_GROUPS,
} from './types';
import type {
  AudibleBook,
  AudibleCatalogItemResponse,
  AudibleCatalogSearchResponse,
  AudibleCodec,
  AudibleContentMetadata,
  AudibleMetadataDrmType,
  AudibleMetadataQuality,
  AudibleMetadataResponse,
  AudibleMetadataResponseGroup,
  AudibleProduct,
  ParsedCodec,
} from './types';

export const ASIN_REGEX = /^(B[\dA-Z]{9}|\d{9}(X|\d))$/;

/**
 * Look into using the Audible API endpoint for more data:
 *
 * https://api.audible.com/1.0/catalog/products/B003XOCKIK?response_groups=contributors,product_desc,product_extended_attrs,product_attrs,media,rating,series,price,reviews,product_plan_details,product_plans,sample,sku,ws4v,relationships,review_attrs,categories,category_ladders,claim_code_url,provided_review&image_sizes=500,1024
 *
 * "contributors, media, price, reviews, product_attrs, "
 * "product_extended_attrs, product_desc, product_plan_details, "
 * "product_plans, rating, sample, sku, series, ws4v, origin, "
 * "relationships, review_attrs, categories, badge_types, "
 * "category_ladders, claim_code_url, is_downloaded, pdf_url, "
 * "is_returnable, origin_asin, percent_complete, provided_review"
 */

const AUDIBLE_BASE_URL = 'https://www.audible.com';

const getApiBaseUrl = (urlOrAsin: string | undefined) => {
  const API_BASE_URL = 'https://api.audible.com/1.0';

  if (!urlOrAsin) {
    return API_BASE_URL;
  }

  if (!isValidUrl(urlOrAsin)) {
    return API_BASE_URL;
  }

  const url = new URL(urlOrAsin);

  const replacedHost = url.host.replace('www.', 'api.');

  return `${url.protocol}//${replacedHost}/1.0`;
};

const IMAGE_SIZES = [500, 1024];

const parseCodecs = (availableCodecs: AudibleCodec[]) => {
  const mappedCodecs = availableCodecs.map((codec) => {
    const baseCodec: ParsedCodec = {
      codec: codec.enhanced_codec,
      isKindleEnhanced: codec.is_kindle_enhanced,
      format: codec.format,
      name: codec.name,
    };

    if (codec.format === 'Format4') {
      return baseCodec;
    }

    const nameValues = baseCodec.name.split('_');

    if (nameValues.length === 3) {
      baseCodec.baseName = nameValues[0];
      baseCodec.sampleRate = Number(nameValues[1]);
      baseCodec.bitRate = Number(nameValues[2]);
    }

    return baseCodec;
  });

  return mappedCodecs;
};

const getAsin = (asinOrUrl: string): string => {
  if (isValidUrl(asinOrUrl)) {
    // URL Probably in format:
    // https://www.audible.com/pd/The-Last-Guardian-Audiobook/B008G39HSY?ref=a_library_t_c5_libItem_&pf_rd_p=80765e81-b10a-4f33-b1d3-ffb87793d047&pf_rd_r=09C9X41GGE1JKKMAX24Y

    const [baseUrl] = asinOrUrl.split('?');
    // baseUrl in format (regardless of whether it had a query string attached):
    // https://www.audible.com/pd/The-Last-Guardian-Audiobook/B008G39HSY

    const pathArr = baseUrl.split('/').filter(Boolean);
    // pathArr in format:
    // ['https:', 'www.audible.com', 'pd', 'The-Last-Guardian-Audiobook', 'B008G39HSY']

    const asin = pathArr[pathArr.length - 1];
    // Last item is ASIN

    return asin.toUpperCase();
  }

  // If the string is not a URL then it must be an ASIN
  return asinOrUrl.toUpperCase();
};

interface ChaptersResponse {
  chapters?: Chapter[];
  metadata?: AudibleContentMetadata;
}

interface AudibleMetadataOptions {
  acr?: string;
  /**
   * The response data groups to return
   *
   * @defaultValue
   * ["chapter_info", "always-returned" , "content_reference" , "content_url"]
   */
  responseGroups?: AudibleMetadataResponseGroup[];
  drmType?: AudibleMetadataDrmType;
  quality?: AudibleMetadataQuality;
}

interface AudibleMetadataParams {
  acr?: string;
  response_groups?: string;
  drm_type?: AudibleMetadataDrmType;
  quality?: AudibleMetadataQuality;
}

/**
 * GET /1.0/content/%\{asin\}/metadata
 * params
 *   response_groups: [chapter_info, always-returned, content_reference, content_url]
 *   acr:
 *   quality: [High, Normal, Extreme, Low]
 *   drm_type: [Mpeg, PlayReady, Hls, Dash, FairPlay, Widevine, HlsCmaf, Adrm]
 */
export async function getAudibleChapters(
  asinOrUrl: string,
  options: AudibleMetadataOptions = {},
): Promise<ChaptersResponse> {
  // https://api.audible.com/1.0/content/B002V0TMJW/metadata?response_groups=chapter_info,always-returned,content_reference,content_url

  const asin = getAsin(asinOrUrl);

  const params: AudibleMetadataParams = {
    response_groups: AUDIBLE_METADATA_RESPONSE_GROUPS.join(','),
  };

  if (options.responseGroups?.length) {
    let newResponseGroups = options.responseGroups.filter((group) =>
      AUDIBLE_METADATA_RESPONSE_GROUPS.includes(group),
    );

    newResponseGroups = [...new Set(newResponseGroups)];

    if (newResponseGroups.length) {
      params.response_groups = newResponseGroups.join(',');
    }
  }

  // If an Audible ACR value is passed, just use that
  if (options.acr) {
    params.acr = options.acr;
  }
  // Otherwise, pass the search params for the highest quality AAX file available for download
  else {
    if (
      options.drmType &&
      AUDIBLE_METADATA_DRM_TYPES.includes(options.drmType)
    ) {
      params.drm_type = options.drmType;
    } else {
      params.drm_type = 'Adrm';
    }

    if (
      options.quality &&
      AUDIBLE_METADATA_QUALITIES.includes(options.quality)
    ) {
      params.quality = options.quality;
    } else {
      params.quality = 'High';
    }
  }

  const metadataUrlParams = new URLSearchParams(
    params as Record<string, string>,
  );

  const apiBaseUrl = getApiBaseUrl(asinOrUrl);
  const apiUrl = `${apiBaseUrl}/content/${asin}/metadata?${metadataUrlParams.toString()}`;

  const metadataRes = await fetch(apiUrl);
  const metadataResData: AudibleMetadataResponse = await metadataRes.json();

  const metadata = metadataResData.content_metadata;

  const chapters = parseAudibleChapters(metadata.chapter_info);

  return { chapters, metadata };
}

export const parseAudibleProduct = async (
  product: AudibleProduct,
): Promise<AudibleBook | null> => {
  try {
    const url = `${AUDIBLE_BASE_URL}/pd/${product.asin}`;

    const authors: Author[] = product.authors.map((author) => ({
      name: author.name,
      url: `${AUDIBLE_BASE_URL}/author/${author.asin}`,
    }));

    let chaptersObj: ChaptersResponse = {};

    try {
      chaptersObj = await getAudibleChapters(product.asin);
    } catch (err) {
      console.error(`Error getting Audible chapters\n${err.stack}`);
    }

    let codecs: ParsedCodec[] = [];

    try {
      codecs = parseCodecs(product.available_codecs);
    } catch (err) {
      console.error(`Error parsing codecs\n${err.stack}`);
    }

    let largeCoverUrl = '';
    let smallCoverUrl = '';

    if (product.product_images) {
      const originalLargeCoverUrl = product.product_images['1024'];
      const originalSmallCoverUrl = product.product_images['500'];

      if (originalLargeCoverUrl) {
        largeCoverUrl = originalLargeCoverUrl.replace('._SL1024_', '');
      }

      if (originalSmallCoverUrl) {
        smallCoverUrl = originalSmallCoverUrl.replace('._SL500_', '');
      }
    }

    const genres: Genre[] = product.category_ladders
      .filter(({ root }) => root === 'Genres')
      .map(({ ladder }) => ladder)
      .reverse()
      .flat()
      .reduce((prev, curr) => {
        const isDuplicate = prev.some(({ name }) => name === curr.name);

        if (isDuplicate) {
          return prev;
        }

        return [...prev, curr];
      }, [])
      .map((genre) => ({
        name: genre.name,
        url: `${AUDIBLE_BASE_URL}/cat/${genre.id}`,
      }));

    return {
      asin: product.asin,
      sku: product.sku,
      url,
      title: cleanTitle(product.title),
      description: cleanDescription(product.publisher_summary) || '',
      largeCoverUrl,
      smallCoverUrl,
      datePublished: new Date(product.release_date).toISOString(),
      duration: product.runtime_length_min * 60,
      rating: {
        ratingValue: product.rating.overall_distribution.average_rating,
        ratingCount: product.rating.num_reviews,
      },
      authors,
      narrators: product.narrators || [],
      series: product.series?.map(
        (series): Series => ({
          name: cleanSeriesTitle(series.title),
          part: Number(series.sequence),
          url: `${AUDIBLE_BASE_URL}${series.url.replace(
            /\/pd\//i,
            '/series/',
          )}`,
        }),
      ),
      genres,
      publisher: product.publisher_name,
      isAbridged: product.format_type !== 'unabridged',
      language: product.language,
      codecs,
      ...chaptersObj,
    };
  } catch (err) {
    console.error(`Error parsing book details\n${err.stack}`);
    return null;
  }
};

/**
 * GET /1.0/catalog/products/%\{asin\}
 *
 * params:
 * - image_dpi:
 * - image_sizes:
 * - response_groups: [contributors, media, product_attrs, product_desc, product_extended_attrs, product_plan_details, product_plans, rating, review_attrs, reviews, sample, sku]
 * - reviews_num_results: \\d+ (max: 10)
 * - reviews_sort_by: [MostHelpful, MostRecent]
 * - asins
 */
export const getAudibleBookInfo = async (asinOrUrl: string) => {
  const asin = getAsin(asinOrUrl);

  const apiUrlParams = new URLSearchParams({
    response_groups: AUDIBLE_CATALOG_RESPONSE_GROUPS.join(','),
    image_sizes: IMAGE_SIZES.join(','),
  });

  const apiBaseUrl = getApiBaseUrl(asinOrUrl);
  const apiUrl = `${apiBaseUrl}/catalog/products/${asin}?${apiUrlParams.toString()}`;

  const audibleRes = await fetch(apiUrl);
  const audibleResData: AudibleCatalogItemResponse = await audibleRes.json();

  const { product } = audibleResData;

  const audibleBook = await parseAudibleProduct(product);

  return audibleBook;
};

interface SearchAudibleApiParams {
  keywords?: string;
  author?: string;
}

/**
 * GET /1.0/catalog/products
 * params
 * - author: string
 * - browse_type:
 * - category_id: \\d+(,\\d+)*
 * - disjunctive_category_ids:
 * - image_dpi: \\d+
 * - image_sizes:
 * - in_plan_timestamp:
 * - keywords:
 * - narrator:
 * - not_in_plan_timestamp:
 * - num_most_recent:
 * - num_results: \\d+ (max: 50)
 * - page: \\d+
 * - plan: [Enterprise, RodizioFreeBasic, AyceRomance, AllYouCanEat, AmazonEnglish, ComplimentaryOriginalMemberBenefit, Radio, SpecialBenefit, Rodizio]
 * - products_since_timestamp:
 * - products_sort_by: [-ReleaseDate, ContentLevel, -Title, AmazonEnglish, AvgRating, BestSellers, -RuntimeLength, ReleaseDate, ProductSiteLaunchDate, -ContentLevel, Title, Relevance, RuntimeLength]
 * - publisher:
 * - response_groups: [contributors, media, price, product_attrs, product_desc, product_extended_attrs, product_plan_details, product_plans, rating, review_attrs, reviews, sample, series, sku]
 * - reviews_num_results: \\d+ (max: 10)
 * - reviews_sort_by: [MostHelpful, MostRecent]
 * - title: string
 */
export async function searchAudibleApi(
  { keywords, author }: SearchAudibleApiParams = {},
  url?: string,
) {
  const params = new URLSearchParams({
    ...(keywords && { keywords }),
    ...(author && { author }),
    products_sort_by: 'Relevance',
    response_groups: AUDIBLE_CATALOG_RESPONSE_GROUPS.join(','),
    image_sizes: IMAGE_SIZES.join(','),
  });

  const apiBaseUrl = getApiBaseUrl(url);
  const searchUrl = `${apiBaseUrl}/catalog/products?${params.toString()}`;

  const res = await fetch(searchUrl);
  const resData: AudibleCatalogSearchResponse = await res.json();

  const audibleItems = await Promise.all(
    resData.products.map((product) => parseAudibleProduct(product)),
  );

  return audibleItems.filter(Boolean);
}

export const audibleHostToCountryCode: Record<string, CountryAlpha2> = {
  'audible.ca': 'CA',
  'audible.com.br': 'BR',
  'audible.co.uk': 'GB',
  'audible.com.au': 'AU',
  'audible.de': 'DE',
  'audible.in': 'IN',
  'audible.it': 'IT',
  'audible.fr': 'FR',
  'audible.es': 'ES',
  'audible.co.jp': 'JP',
  'audible.com': 'US',
};

export const getCountryCodeFromAudibleHost = (host: string): CountryAlpha2 => {
  const cleanHost = host.replace(/^www\./, '');

  const matchingCountryCode = audibleHostToCountryCode[cleanHost];

  return matchingCountryCode ?? 'US';
};
