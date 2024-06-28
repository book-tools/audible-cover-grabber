import { alpha3CountryCodeSchema } from 'utils/countries';
import { currencyCodeSchema } from 'utils/currencies';
import { z } from 'zod';

export const explicitnessSchema = z.union([
  z.literal('notExplicit'),
  z.literal('explicit'),
  z.literal('cleaned'),
  z.string(),
]);

export const itunesMusicSchema = z.object({
  wrapperType: z.string(),
  kind: z.string(),
  artistId: z.number(),
  collectionId: z.number(),
  trackId: z.number(),
  artistName: z.string(),
  collectionName: z.string(),
  trackName: z.string(),
  collectionCensoredName: z.string(),
  trackCensoredName: z.string(),
  artistViewUrl: z.string(),
  collectionViewUrl: z.string(),
  trackViewUrl: z.string(),
  previewUrl: z.string(),
  artworkUrl30: z.string(),
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  collectionPrice: z.number(),
  trackPrice: z.number(),
  releaseDate: z.date(),
  collectionExplicitness: explicitnessSchema,
  trackExplicitness: explicitnessSchema,
  discCount: z.number(),
  discNumber: z.number(),
  trackCount: z.number(),
  trackNumber: z.number(),
  trackTimeMillis: z.number(),
  country: z.string(),
  currency: z.string(),
  primaryGenreName: z.string(),
  contentAdvisoryRating: z.string(),
  isStreamable: z.boolean(),
});

export const itunesMusicVideoSchema = z.object({
  wrapperType: z.string(),
  kind: z.string(),
  artistId: z.number(),
  trackId: z.number(),
  artistName: z.string(),
  trackName: z.string(),
  trackCensoredName: z.string(),
  artistViewUrl: z.string(),
  trackViewUrl: z.string(),
  previewUrl: z.string(),
  artworkUrl30: z.string(),
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  collectionPrice: z.number(),
  trackPrice: z.number(),
  releaseDate: z.date(),
  collectionExplicitness: explicitnessSchema,
  trackExplicitness: explicitnessSchema,
  trackTimeMillis: z.number(),
  country: z.string(),
  currency: z.string(),
  primaryGenreName: z.string(),
  contentAdvisoryRating: z.string(),
});

export const itunesArtistSchema = z.object({
  wrapperType: z.string(),
  artistType: z.string(),
  artistName: z.string(),
  artistLinkUrl: z.string(),
  artistId: z.number(),
  primaryGenreName: z.string(),
  primaryGenreId: z.number(),
});

export const itunesAlbumSchema = z.object({
  wrapperType: z.string(),
  collectionType: z.string(),
  artistId: z.number(),
  collectionId: z.number(),
  amgArtistId: z.number(),
  artistName: z.string(),
  collectionName: z.string(),
  collectionCensoredName: z.string(),
  artistViewUrl: z.string(),
  collectionViewUrl: z.string(),
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  collectionPrice: z.number(),
  collectionExplicitness: explicitnessSchema,
  contentAdvisoryRating: z.string(),
  trackCount: z.number(),
  copyright: z.string(),
  country: z.string(),
  currency: z.string(),
  releaseDate: z.date(),
  primaryGenreName: z.string(),
});

export const itunesSoftwareSchema = z.object({
  screenshotUrls: z.array(z.string()),
  ipadScreenshotUrls: z.array(z.string()),
  appletvScreenshotUrls: z.array(z.string()),
  artworkUrl60: z.string(),
  artworkUrl512: z.string(),
  artworkUrl100: z.string(),
  artistViewUrl: z.string(),
  supportedDevices: z.array(z.string()),
  advisories: z.array(z.string()),
  isGameCenterEnabled: z.boolean(),
  features: z.array(z.string()),
  kind: z.string(),
  minimumOsVersion: z.string(),
  trackCensoredName: z.string(),
  languageCodesISO2A: z.array(z.string()),
  fileSizeBytes: z.string(),
  sellerUrl: z.string(),
  formattedPrice: z.string(),
  contentAdvisoryRating: z.string(),
  averageUserRatingForCurrentVersion: z.number(),
  userRatingCountForCurrentVersion: z.number(),
  averageUserRating: z.number(),
  trackViewUrl: z.string(),
  trackContentRating: z.string(),
  trackId: z.number(),
  trackName: z.string(),
  genreIds: z.array(z.string()),
  releaseDate: z.date(),
  sellerName: z.string(),
  primaryGenreName: z.string(),
  isVppDeviceBasedLicensingEnabled: z.boolean(),
  currentVersionReleaseDate: z.date(),
  releaseNotes: z.string(),
  primaryGenreId: z.number(),
  currency: z.string(),
  description: z.string(),
  artistId: z.number(),
  artistName: z.string(),
  genres: z.array(z.string()),
  price: z.number(),
  bundleId: z.string(),
  version: z.string(),
  wrapperType: z.string(),
  userRatingCount: z.number(),
});

export const itunesMovieSchema = z.object({
  wrapperType: z.string(),
  kind: z.string(),
  collectionId: z.number(),
  trackId: z.number(),
  artistName: z.string(),
  collectionName: z.string(),
  trackName: z.string(),
  collectionCensoredName: z.string(),
  trackCensoredName: z.string(),
  collectionArtistId: z.number(),
  collectionArtistViewUrl: z.string(),
  collectionViewUrl: z.string(),
  trackViewUrl: z.string(),
  previewUrl: z.string(),
  artworkUrl30: z.string(),
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  collectionPrice: z.number(),
  trackPrice: z.number(),
  trackRentalPrice: z.number(),
  collectionHdPrice: z.number(),
  trackHdPrice: z.number(),
  trackHdRentalPrice: z.number(),
  releaseDate: z.date(),
  collectionExplicitness: explicitnessSchema,
  trackExplicitness: explicitnessSchema,
  discCount: z.number(),
  discNumber: z.number(),
  trackCount: z.number(),
  trackNumber: z.number(),
  trackTimeMillis: z.number(),
  country: z.string(),
  currency: z.string(),
  primaryGenreName: z.string(),
  contentAdvisoryRating: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  hasITunesExtras: z.boolean(),
});

export const itunesEbookSchema = z.object({
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  artistViewUrl: z.string(),
  trackCensoredName: z.string(),
  fileSizeBytes: z.number(),
  formattedPrice: z.string(),
  trackViewUrl: z.string(),
  artistIds: z.array(z.number()),
  genreIds: z.array(z.string()),
  releaseDate: z.date(),
  currency: z.string(),
  description: z.string(),
  artistId: z.number(),
  artistName: z.string(),
  genres: z.array(z.string()),
  price: z.number(),
  trackId: z.number(),
  trackName: z.string(),
  kind: z.string(),
  averageUserRating: z.number(),
  userRatingCount: z.number(),
});

export const itunesAudiobookSchema = z
  .object({
    wrapperType: z.string(),
    collectionId: z.number(),
    collectionName: z.string().default(''),
    collectionCensoredName: z.string().default(''),
    collectionViewUrl: z.string(),
    artistId: z.number(),
    amgArtistId: z.number().optional(),
    artistName: z.string(),
    artistViewUrl: z.string(),
    artworkUrl60: z.string(),
    artworkUrl100: z.string(),
    artworkUrl600: z.string().optional(),
    artworkUrlHiRes: z.string().optional(),
    collectionPrice: z.number(),
    collectionExplicitness: explicitnessSchema,
    trackCount: z.number(),
    country: alpha3CountryCodeSchema,
    currency: currencyCodeSchema,
    /**
     * An ISO date string
     */
    releaseDate: z.string(),
    primaryGenreName: z.string(),
    previewUrl: z.string(),
    /**
     * A description string with basic html tags
     */
    description: z.string(),
    copyright: z.string().optional(),
  })
  .strict();
export type ItunesAudiobook = z.infer<typeof itunesAudiobookSchema>;

export const itunesPodcastSchema = z.object({
  wrapperType: z.string(),
  kind: z.string(),
  artistId: z.number(),
  collectionId: z.number(),
  trackId: z.number(),
  artistName: z.string(),
  collectionName: z.string(),
  trackName: z.string(),
  collectionCensoredName: z.string(),
  trackCensoredName: z.string(),
  artistViewUrl: z.string(),
  collectionViewUrl: z.string(),
  feedUrl: z.string(),
  trackViewUrl: z.string(),
  artworkUrl30: z.string(),
  artworkUrl60: z.string(),
  artworkUrl100: z.string(),
  collectionPrice: z.number(),
  trackPrice: z.number(),
  trackRentalPrice: z.number(),
  collectionHdPrice: z.number(),
  trackHdPrice: z.number(),
  trackHdRentalPrice: z.number(),
  releaseDate: z.date(),
  collectionExplicitness: explicitnessSchema,
  trackExplicitness: explicitnessSchema,
  trackCount: z.number(),
  country: z.string(),
  currency: z.string(),
  primaryGenreName: z.string(),
  artworkUrl600: z.string(),
  genreIds: z.array(z.string()),
  genres: z.array(z.string()),
});

export const itunesAnySchema = z.union([
  itunesMusicSchema,
  itunesMusicVideoSchema,
  itunesArtistSchema,
  itunesAlbumSchema,
  itunesSoftwareSchema,
  itunesMovieSchema,
  itunesEbookSchema,
  itunesAudiobookSchema,
  itunesPodcastSchema,
]);

export const itunesMusicResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesMusicSchema),
});

export const itunesMusicVideoResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesMusicVideoSchema),
});

export const itunesArtistResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesArtistSchema),
});

export const itunesAlbumResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesAlbumSchema),
});

export const itunesSoftwareResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesSoftwareSchema),
});

export const itunesMovieResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesMovieSchema),
});

export const itunesEbookResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesEbookSchema),
});

export const itunesAudiobookResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesAudiobookSchema),
});
export type ItunesAudiobookResponse = z.infer<
  typeof itunesAudiobookResponseSchema
>;

export const itunesPodcastResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesPodcastSchema),
});

export const itunesAllResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(itunesAnySchema),
});
