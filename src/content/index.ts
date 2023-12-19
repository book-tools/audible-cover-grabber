import type { EXTResponse, GetCurrentBookMessage } from 'types/message';
import { getAudibleBookInfo } from 'utils/audible/audible';
import type { AudibleBook } from 'utils/audible/types';
import { runtime } from 'webextension-polyfill';

const getCurrentAudibleBook = async (): Promise<AudibleBook | null> => {
  const currentUrl = window.location.href;
  const audibleBook = await getAudibleBookInfo(currentUrl);
  return audibleBook;
};

const onRequest = async (msg: GetCurrentBookMessage): Promise<EXTResponse> => {
  switch (msg.type) {
    case 'GET_CURRENT_BOOK': {
      const book = await getCurrentAudibleBook();
      return { type: 'SUCCESS', data: book };
    }
    default:
      return { type: 'FAILED' };
  }
};

runtime.onMessage.addListener(onRequest);
