import type { EXTResponse, GetCurrentBookMessage } from 'types/message';
import {
  getAudibleBookInfo,
  getCountryCodeFromAudibleHost,
} from 'utils/audible/audible';
import type { AudibleBook } from 'utils/audible/types';
import { getItunesMatches } from 'utils/itunes/get-itunes-match';
import type { ItunesAudiobook } from 'utils/itunes/schemas/response';
import { runtime } from 'webextension-polyfill';

const getMatchingItunesBooks = async (
  book: AudibleBook | null,
): Promise<ItunesAudiobook[]> => {
  if (!book) {
    return [];
  }

  const currentHost = window.location.host;
  const countryCode = getCountryCodeFromAudibleHost(currentHost);
  const itunesBooks = await getItunesMatches(book, countryCode);
  return itunesBooks;
};

const getCurrentAudibleBook = async (): Promise<AudibleBook | null> => {
  const currentUrl = window.location.href;
  const audibleBook = await getAudibleBookInfo(currentUrl);
  return audibleBook;
};

const onRequest = async (msg: GetCurrentBookMessage): Promise<EXTResponse> => {
  switch (msg.type) {
    case 'GET_CURRENT_BOOK': {
      const book = await getCurrentAudibleBook();

      if (!book) {
        return { type: 'FAILED' };
      }

      const itunesBooks = await getMatchingItunesBooks(book);

      return { type: 'SUCCESS', data: { audibleBook: book, itunesBooks } };
    }
    default:
      return { type: 'FAILED' };
  }
};

runtime.onMessage.addListener(onRequest);
