import { DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  useBoolean,
} from '@chakra-ui/react';
import Cover from 'components/cover';
import React, { useEffect, useRef, useState } from 'react';
import type { EXTResponse } from 'types/message';
import type { AudibleBook } from 'utils/audible/types';
import { tabs } from 'webextension-polyfill';

const Popup = () => {
  const [isLoading, setIsLoading] = useBoolean(true);
  const [book, setBook] = useState<AudibleBook | null>(null);
  const [error, setError] = useState<string>('');

  const hasInitialized = useRef(false);
  const hasRetriedInit = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const intialize = async () => {
      try {
        const [activeTab] = await tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!activeTab?.id) {
          throw new Error('No active tab found');
        }
        const audibleBookRes: EXTResponse = await tabs.sendMessage(
          activeTab.id,
          {
            type: 'GET_CURRENT_BOOK',
          },
        );

        setBook(audibleBookRes.data || null);

        // TODO: Add a search for other books with the same title/author
        // both on Audible (some Audible books are only available in certain regions)
        // and iTunes for better cover resolution
        setIsLoading.off();
      } catch (err) {
        console.error(err);
        if (!hasRetriedInit.current) {
          hasRetriedInit.current = true;
          setTimeout(intialize, 100);
          return;
        }
        setIsLoading.off();
        setError(
          `There was an error loading the book's information: ${err.message}`,
        );
      }
    };

    intialize();
  }, [setIsLoading]);

  const getContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return <Box>{error}</Box>;
    }

    if (!book) {
      return <Box>Book not found</Box>;
    }

    if (!book.largeCoverUrl) {
      return <Box>No high resolution cover was found for the current book</Box>;
    }

    return (
      <Flex direction="column" gap={4}>
        <Cover coverUrl={book.largeCoverUrl} />

        <Button
          w="full"
          as="a"
          href={book.largeCoverUrl}
          download
          colorScheme="blue"
          size="sm"
          leftIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Flex>
    );
  };

  return (
    <Center minH="500px" w="500px" p={8}>
      {getContent()}
    </Center>
  );
};

export default Popup;
