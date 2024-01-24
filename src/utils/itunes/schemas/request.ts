import { alpha2CountryCodeSchema } from 'utils/countries';
import { z } from 'zod';

export const itunesMediaTypeSchema = z.union([
  z.literal('movie'),
  z.literal('podcast'),
  z.literal('music'),
  z.literal('musicVideo'),
  z.literal('audiobook'),
  z.literal('shortFilm'),
  z.literal('tvShow'),
  z.literal('software'),
  z.literal('ebook'),
  z.literal('all'),
]);

export const itunesMovieEntitySchema = z.union([
  z.literal('movieArtist'),
  z.literal('movie'),
]);

export const itunesPodcastEntitySchema = z.union([
  z.literal('podcastAuthor'),
  z.literal('podcast'),
]);

export const itunesMusicEntitySchema = z.union([
  z.literal('musicArtist'),
  z.literal('musicTrack'),
  z.literal('album'),
  z.literal('musicVideo'),
  z.literal('mix'),
  z.literal('song'),
]);

export const itunesMusicVideoEntitySchema = z.union([
  z.literal('musicArtist'),
  z.literal('musicVideo'),
]);

export const itunesAudiobookEntitySchema = z.union([
  z.literal('audiobookAuthor'),
  z.literal('audiobook'),
]);

export const itunesShortFilmEntitySchema = z.union([
  z.literal('shortFilmArtist'),
  z.literal('shortFilm'),
]);

export const itunesTvShowEntitySchema = z.union([
  z.literal('tvEpisode'),
  z.literal('tvSeason'),
]);

export const itunesSoftwareEntitySchema = z.union([
  z.literal('software'),
  z.literal('iPadSoftware'),
  z.literal('macSoftware'),
]);

export const itunesEbookEntitySchema = z.literal('ebook');

export const itunesAllEntitySchema = z.union([
  z.literal('movie'),
  z.literal('album'),
  z.literal('allArtist'),
  z.literal('podcast'),
  z.literal('musicVideo'),
  z.literal('mix'),
  z.literal('audiobook'),
  z.literal('tvSeason'),
  z.literal('allTrack'),
]);

export const itunesEntitySchema = z.union([
  itunesMovieEntitySchema,
  itunesPodcastEntitySchema,
  itunesMusicEntitySchema,
  itunesMusicVideoEntitySchema,
  itunesAudiobookEntitySchema,
  itunesShortFilmEntitySchema,
  itunesTvShowEntitySchema,
  itunesSoftwareEntitySchema,
  itunesEbookEntitySchema,
  itunesAllEntitySchema,
]);

export const itunesMovieAttributeSchema = z.union([
  z.literal('actorTerm'),
  z.literal('genreIndex'),
  z.literal('artistTerm'),
  z.literal('shortFilmTerm'),
  z.literal('producerTerm'),
  z.literal('ratingTerm'),
  z.literal('directorTerm'),
  z.literal('releaseYearTerm'),
  z.literal('featureFilmTerm'),
  z.literal('movieArtistTerm'),
  z.literal('movieTerm'),
  z.literal('ratingIndex'),
  z.literal('descriptionTerm'),
]);

export const itunesPodcastAttributeSchema = z.union([
  z.literal('titleTerm'),
  z.literal('languageTerm'),
  z.literal('authorTerm'),
  z.literal('genreIndex'),
  z.literal('artistTerm'),
  z.literal('ratingIndex'),
  z.literal('keywordsTerm'),
  z.literal('descriptionTerm'),
]);

export const itunesMusicAttributeSchema = z.union([
  z.literal('mixTerm'),
  z.literal('genreIndex'),
  z.literal('artistTerm'),
  z.literal('composerTerm'),
  z.literal('albumTerm'),
  z.literal('ratingIndex'),
  z.literal('songTerm'),
]);

export const itunesMusicVideoAttributeSchema = z.union([
  z.literal('genreIndex'),
  z.literal('artistTerm'),
  z.literal('albumTerm'),
  z.literal('ratingIndex'),
  z.literal('songTerm'),
]);

export const itunesAudiobookAttributeSchema = z.union([
  z.literal('titleTerm'),
  z.literal('authorTerm'),
  z.literal('genreIndex'),
  z.literal('ratingIndex'),
]);

export const itunesShortFilmAttributeSchema = z.union([
  z.literal('genreIndex'),
  z.literal('artistTerm'),
  z.literal('shortFilmTerm'),
  z.literal('ratingIndex'),
  z.literal('descriptionTerm'),
]);

export const itunesSoftwareAttributeSchema = z.literal('softwareDeveloper');

export const itunesTvShowAttributeSchema = z.union([
  z.literal('genreIndex'),
  z.literal('tvEpisodeTerm'),
  z.literal('showTerm'),
  z.literal('tvSeasonTerm'),
  z.literal('ratingIndex'),
  z.literal('descriptionTerm'),
]);

export const itunesAllAttributeSchema = z.union([
  z.literal('actorTerm'),
  z.literal('languageTerm'),
  z.literal('allArtistTerm'),
  z.literal('tvEpisodeTerm'),
  z.literal('shortFilmTerm'),
  z.literal('directorTerm'),
  z.literal('releaseYearTerm'),
  z.literal('titleTerm'),
  z.literal('featureFilmTerm'),
  z.literal('ratingIndex'),
  z.literal('keywordsTerm'),
  z.literal('descriptionTerm'),
  z.literal('authorTerm'),
  z.literal('genreIndex'),
  z.literal('mixTerm'),
  z.literal('allTrackTerm'),
  z.literal('artistTerm'),
  z.literal('composerTerm'),
  z.literal('tvSeasonTerm'),
  z.literal('producerTerm'),
  z.literal('ratingTerm'),
  z.literal('songTerm'),
  z.literal('movieArtistTerm'),
  z.literal('showTerm'),
  z.literal('movieTerm'),
  z.literal('albumTerm'),
]);

export const itunesAttributeSchema = z.union(
  [
    itunesMovieAttributeSchema,
    itunesPodcastAttributeSchema,
    itunesMusicAttributeSchema,
    itunesMusicVideoAttributeSchema,
    itunesAudiobookAttributeSchema,
    itunesShortFilmAttributeSchema,
    itunesSoftwareAttributeSchema,
    itunesTvShowAttributeSchema,
    itunesAllAttributeSchema,
  ],
  {
    invalid_type_error:
      'Please only use allowed attributes for the specified entity',
  },
);

export const baseItunesSearchParamsSchema = z.object({
  /**
   * The string you want to search for.
   *
   * For example: "jack johnson".
   */
  term: z
    .string({
      invalid_type_error: 'Term must be a string',
    })
    .min(1, 'Term must be included'),

  /**
   * The two-letter country code for the store you want to search. The search
   * uses the default store front for the specified country. For example: US.
   *
   * @defaultValue `US`
   */
  country: alpha2CountryCodeSchema.optional().default('US'),

  /**
   * The media type you want to search for. For example: movie.
   *
   * @defaultValue `all`
   */
  media: itunesMediaTypeSchema.default('all'),

  /**
   * The type of results you want returned, relative to the specified media
   * type. For example: movieArtist for a movie media type search. The default
   * is the track entity associated with the specified media type.
   *
   * @see {@link https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW2}
   */
  entity: itunesEntitySchema.optional(),

  /**
   * The attributes you want to search for in the stores, relative to the
   * specified media type. For example, if you want to search for an artist by
   * name specify entity=allArtist&attribute=allArtistTerm. In this example, if
   * you search for term=maroon, iTunes returns “Maroon 5” in the search
   * results, instead of all artists who have ever recorded a song with the
   * word “maroon” in the title.
   *
   * The default is all attributes associated with the specified media type.
   *
   * @see {@link https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW3}
   */
  attributes: z.array(itunesAttributeSchema).default([]),

  /**
   * The number of search results you want the iTunes Store to return.
   *
   * Must be between 1 and 200.
   *
   * @defaultValue `50`
   */
  limit: z
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .gte(1, 'Limit must be between 1 and 200')
    .lte(200, 'Limit must be between 1 and 200')
    .default(50),

  /**
   * The language, English or Japanese, you want to use when returning search
   * results. Specify the language using the five-letter codename.
   *
   * @defaultValue `en_us`
   */
  lang: z
    .union([z.literal('en_us'), z.literal('ja_jp')], {
      invalid_type_error: "Language must be either 'en_us' or 'ja_jp'",
    })
    .default('en_us'),

  /**
   * The search result key version you want to receive back from your search.
   *
   * @defaultValue `2`
   */
  version: z
    .union([z.literal(2), z.literal(1)], {
      invalid_type_error: 'Version must be either 1 or 2',
    })
    .default(2),

  /**
   * A flag indicating whether or not you want to include explicit content in
   * your search results.
   *
   * @defaultValue `Yes`
   */
  explicit: z
    .union([z.literal('Yes'), z.literal('No')], {
      invalid_type_error: "Explicit must be either 'Yes' or 'No'",
    })
    .default('Yes'),
});

export const itunesMovieSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('movie').default('movie'),
    entity: itunesMovieEntitySchema.default('movie'),
    attributes: z.array(itunesMovieAttributeSchema).default([]),
  });

export const itunesPodcastSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('podcast').default('podcast'),
    entity: itunesPodcastEntitySchema.default('podcast'),
    attributes: z.array(itunesPodcastAttributeSchema).default([]),
  });

export const itunesMusicSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('music').default('music'),
    entity: itunesMusicEntitySchema.default('musicTrack'),
    attributes: z.array(itunesMusicAttributeSchema).default([]),
  });

export const itunesMusicVideoSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('musicVideo').default('musicVideo'),
    entity: itunesMusicVideoEntitySchema.default('musicVideo'),
    attributes: z.array(itunesMusicVideoAttributeSchema).default([]),
  });

export const itunesAudiobookSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('audiobook').default('audiobook'),
    entity: itunesAudiobookEntitySchema.default('audiobook'),
    attributes: z.array(itunesAudiobookAttributeSchema).default([]),
  });
export type AudiobookSearchParams = z.input<
  typeof itunesAudiobookSearchParamsSchema
>;

export const itunesShortFilmSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('shortFilm').default('shortFilm'),
    entity: itunesShortFilmEntitySchema.default('shortFilm'),
    attributes: z.array(itunesShortFilmAttributeSchema).default([]),
  });

export const itunesTvShowSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('tvShow').default('tvShow'),
    entity: itunesTvShowEntitySchema.default('tvEpisode'),
    attributes: z.array(itunesTvShowAttributeSchema).default([]),
  });

export const itunesSoftwareSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('software').default('software'),
    entity: itunesSoftwareEntitySchema.optional().default('software'),
    attributes: z.array(itunesSoftwareAttributeSchema).default([]),
  });

export const itunesEbookSearchParamsSchema =
  baseItunesSearchParamsSchema.extend({
    media: z.literal('ebook').default('ebook'),
    entity: itunesEbookEntitySchema.default('ebook'),
  });

export const itunesAllSearchParamsSchema = baseItunesSearchParamsSchema.extend({
  media: z.literal('all').default('all'),
  entity: itunesAllEntitySchema.optional(),
  attributes: z.array(itunesAllAttributeSchema).default([]),
});

export const itunesSearchParamsSchema = z.discriminatedUnion('media', [
  itunesMovieSearchParamsSchema,
  itunesPodcastSearchParamsSchema,
  itunesMusicSearchParamsSchema,
  itunesMusicVideoSearchParamsSchema,
  itunesAudiobookSearchParamsSchema,
  itunesShortFilmSearchParamsSchema,
  itunesTvShowSearchParamsSchema,
  itunesSoftwareSearchParamsSchema,
  itunesEbookSearchParamsSchema,
  itunesAllSearchParamsSchema,
]);
