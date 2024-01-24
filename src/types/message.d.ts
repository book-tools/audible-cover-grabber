import type { AudibleBook } from 'utils/audible/types';
import type { ItunesAudiobook } from 'utils/itunes/schemas/response';

declare type EXTMessageType = 'GET_CURRENT_BOOK';

declare type EXTMessage = {
  type: EXTMessageType;
  data?: unknown;
};

declare interface GetCurrentBookMessage extends EXTMessage {
  type: 'GET_CURRENT_BOOK';
  data: never;
}

declare type EXTResponseType =
  | 'SUCCESS'
  | 'FAILED'
  | 'PENDING'
  | 'UNAUTHORIZED'
  | 'AUTHENTICATED';

declare type EXTResponse = {
  type: EXTResponseType;
  data?: {
    audibleBook: AudibleBook | null;
    itunesBooks: ItunesAudiobook[];
  };
};
