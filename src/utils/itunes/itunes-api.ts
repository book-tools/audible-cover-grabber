import { convertToStringParams } from '../object';
import type { AudiobookSearchParams } from './schemas/request';
import { itunesAudiobookSearchParamsSchema } from './schemas/request';
import { itunesAudiobookResponseSchema } from './schemas/response';
import type {
  ItunesAudiobook,
  ItunesAudiobookResponse,
} from './schemas/response';

const ITUNES_BASE_SEARCH_URL = 'https://itunes.apple.com/search';

export const searchItunesAudiobooks = async (
  params: AudiobookSearchParams,
): Promise<ItunesAudiobookResponse> => {
  const parsedParams = itunesAudiobookSearchParamsSchema.parse(params);

  const { attributes = [], ...restParams } = parsedParams;

  const strParams = convertToStringParams(restParams);
  const finalParams = new URLSearchParams(strParams);
  attributes.forEach((attribute) => {
    finalParams.append('attribute', attribute);
  });

  const searchUrl = `${ITUNES_BASE_SEARCH_URL}?${finalParams.toString()}`;

  const res = await fetch(searchUrl);
  const resData = await res.json();
  const itunesResData = itunesAudiobookResponseSchema.parse(resData);

  itunesResData.results = itunesResData.results.map<ItunesAudiobook>(
    (book) => ({
      ...book,
      artworkUrl600: book.artworkUrl100?.replace('100x100', '600x600'),
      artworkUrlHiRes: book.artworkUrl100?.replace(
        '100x100bb',
        '100000x100000-999',
      ),
    }),
  );

  return itunesResData;
};
