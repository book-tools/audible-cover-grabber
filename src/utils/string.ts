import { convert as convertHtmlToText } from 'html-to-text';
import type { Author } from 'types/book';

export const cleanDescription = (description: string) => {
  if (!description) {
    return null;
  }

  let desc = convertHtmlToText(description, { wordwrap: false });

  // Repace any instances of 3 or more newline characters with 2 newline characters
  desc = desc.replace(/\n{3,}/g, '\n\n');
  // Replace the start of any unordered list items with a bullet character
  desc = desc.replace(/\n( +)\* /g, '\n$1• ');
  // Replace any ellipses characters with three periods
  desc = desc.replace(/\u2026/g, '...');
  // Replace any extra long ellipses with 3 periods
  desc = desc.replace(/\.{3,}/g, '...');
  // Remove any trailing spaces
  desc = desc.trim();

  return desc;
};

export const stripDiacretics = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const removeNonWordChars = (str: string): string =>
  str.replace(/\W+/g, ' ');

export const removeSpaces = (str: string): string => str.replace(/\s/g, '');

/**
 * If there are 2 or more spaces in a row, replace them with a single space
 * and trim any leading and trailing spaces
 *
 * @param str - An input string
 * @returns The cleaned string
 */
export const removeExtraSpaces = (str: string): string =>
  str.replace(/\s{2,}/g, ' ').trim();

export const simplify = (str: string): string =>
  removeSpaces(removeNonWordChars(stripDiacretics(str).toLowerCase()));

export const fuzzyMatch = (
  str1: string,
  str2: string,
  checkIncludes = false,
) => {
  const simpleStr1 = simplify(str1);
  const simpleStr2 = simplify(str2);

  return (
    simpleStr1 === simpleStr2 ||
    (checkIncludes &&
      (simpleStr1.includes(simpleStr2) || simpleStr2.includes(simpleStr1)))
  );
};

export const cleanTitle = (title: string) => {
  if (!title) {
    return title;
  }

  let newTitle = title.trim();

  // If the title ends with a series part, remove it
  // works for "Book 1" and "Book One"
  newTitle = newTitle.replace(/, book [\w\s-]+$/i, '').trim();

  // If the title ends with "unabridged", with or without parenthesis
  // remove them; case insensitive
  newTitle = newTitle.replace(/\(?unabridged\)?$/i, '').trim();

  // If there are 2 or more spaces in a row, replace them with a single space
  newTitle = removeExtraSpaces(newTitle);

  return newTitle;
};

export const cleanSeriesTitle = (seriesTitle: string): string => {
  // If the series name includes the word "Series" at the end, remove it
  let newSeriesTitle = seriesTitle.replace(/\s*Series\s*$/i, '');

  // Remove any extra trailing or leading spaces
  newSeriesTitle = newSeriesTitle.trim();

  return newSeriesTitle;
};

export const getCopyrightYear = (copyright: string): string => {
  if (!copyright) {
    return '';
  }

  const yearMatch = copyright.match(/\d{4}/);

  if (yearMatch && yearMatch[0]) {
    return yearMatch[0];
  }

  return '';
};

export const checkAuthorOverlap = (authors1: Author[], authors2: Author[]) => {
  for (let i = 0; i < authors1.length; i += 1) {
    for (let j = 0; j < authors2.length; j += 1) {
      if (fuzzyMatch(authors1[i].name, authors2[j].name)) {
        return true;
      }
    }
  }

  return false;
};

export const sanitizeArg = (arg: string | number): string =>
  arg.toString().replace(/"/g, '"\'"\'"');

export const kebabCase = (str: string): string => {
  const simplified = str.toLowerCase().replace(/[^-a-z0-9\s]/g, '');

  const strArr = simplified.split(' ').filter(Boolean);

  return strArr.join('-');
};

export const splitOnNewline = (str: string, trimSpaces = false): string[] => {
  const result = str.split(/\r?\n/);

  if (trimSpaces) {
    return result.map((line) => line.trim());
  }

  return result;
};

export const getLastFirstName = (name: string): string => {
  const nameArr = name.split(' ');

  if (nameArr.length === 1) {
    return name;
  }

  const lastName = nameArr.pop();
  const firstName = nameArr.join(' ');

  return `${lastName}, ${firstName}`;
};

export const removeTrailingSlash = (str: string): string => {
  const cleanStr = str.replace(/\/$/, '');

  return cleanStr;
};
