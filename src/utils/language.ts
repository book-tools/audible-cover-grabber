import languages, { type Language } from './iso-language-codes';

export const getLanguageByName = (name: string): Language | null => {
  if (!name) {
    return null;
  }

  const match = languages.find(
    (language) =>
      language.name === name ||
      language.nativeName === name ||
      language.name.toLowerCase() === name.toLowerCase() ||
      language.nativeName.toLowerCase() === name.toLowerCase(),
  );

  return match || null;
};

export const getLanguageByIso1 = (code: string): Language | null => {
  if (!code) {
    return null;
  }

  const match = languages.find(
    (language) => language.iso639_1 === code.toLowerCase(),
  );

  return match || null;
};

export const parseLanguage = (lang: string): Language | null => {
  if (!lang || typeof lang !== 'string') {
    return null;
  }

  let match;

  if (lang.length === 2) {
    match = languages.find(
      (language) => language.iso639_1 === lang.toLowerCase(),
    );
  }

  if (!match && lang.length === 3) {
    match = languages.find(
      (language) =>
        language.iso639_2_T === lang.toLowerCase() ||
        language.iso639_2_B === lang.toLowerCase() ||
        language.iso639_2_B === lang.toLowerCase(),
    );
  }

  if (!match) {
    match = languages.find(
      (language) =>
        language.name.toLowerCase() === lang.toLowerCase() ||
        language.nativeName.toLowerCase() === lang.toLowerCase(),
    );
  }

  return match || null;
};
