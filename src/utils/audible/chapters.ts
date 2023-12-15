import type { Chapter } from 'types/book';
import type { AudibleChapterInfo } from './types';

export const parseAudibleChapters = (
  chapterInfo: AudibleChapterInfo,
  removeIntroOffset = false,
): Chapter[] => {
  const chapters = chapterInfo.chapters.map((chapter, i) => {
    const startOffset =
      i === 0 || !removeIntroOffset ? 0 : -1 * chapterInfo.brandIntroDurationMs;

    const trackStart = (chapter.start_offset_ms + startOffset) / 1000;

    return {
      title: chapter.title,
      timeIntoBook: trackStart,
    };
  });

  return chapters;
};
