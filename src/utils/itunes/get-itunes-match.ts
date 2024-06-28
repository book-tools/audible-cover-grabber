import type { Author } from 'types/book';
import type { AudibleBook } from 'utils/audible/types';
import type { CountryAlpha2 } from 'utils/countries';
import {
  checkAuthorOverlap,
  fuzzyMatch,
  removeNonWordChars,
} from 'utils/string';
import { searchItunesAudiobooks } from './itunes-api';
import type {
  ItunesAudiobook,
  ItunesAudiobookResponse,
} from './schemas/response';

const findMatchingItunesBooks = (
  title: string,
  authors: Author[],
  itunesData: ItunesAudiobookResponse,
): ItunesAudiobook[] => {
  return itunesData.results.filter((item) => {
    if (!item.artistName) {
      return false;
    }

    const titlesMatch = fuzzyMatch(title, item.collectionName, true);

    const itunesAuthors = item.artistName
      .split('&')
      .map((author): Author => ({ name: author.trim() }));

    const authorsMatch = checkAuthorOverlap(itunesAuthors, authors);

    return titlesMatch && authorsMatch;
  });
};

export const getItunesMatches = async (
  book: AudibleBook,
  country: CountryAlpha2 = 'US',
): Promise<ItunesAudiobook[]> => {
  try {
    let itunesData = await searchItunesAudiobooks({
      term: removeNonWordChars(book.title),
      attributes: ['titleTerm'],
      country,
      limit: 200,
    });

    let matches = findMatchingItunesBooks(book.title, book.authors, itunesData);

    if (!matches.length) {
      itunesData = await searchItunesAudiobooks({
        term: removeNonWordChars(book.title),
        attributes: ['titleTerm'],
        country,
        limit: 200,
      });

      matches = findMatchingItunesBooks(book.title, book.authors, itunesData);
    }

    return matches;
  } catch (err) {
    console.warn('Error grabbing iTunes info');
    console.warn(err.stack);
    return [];
  }
};

export const getItunesMatch = async (
  book: AudibleBook,
): Promise<ItunesAudiobook | null> => {
  const matches = await getItunesMatches(book);
  return matches[0] ?? null;
};
