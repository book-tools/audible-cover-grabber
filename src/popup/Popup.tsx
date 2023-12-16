import { DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Spinner } from '@chakra-ui/react';
import Cover from 'components/cover';
import React, { useEffect, useState } from 'react';
import { ASIN_REGEX, getAudibleBookInfo } from 'utils/audible/audible';
import type { AudibleBook } from 'utils/audible/types';
import { tabs } from 'webextension-polyfill';

const Popup = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [book, setBook] = useState<AudibleBook | null>(null);

  useEffect(() => {
    const intialize = async () => {
      const [firstActiveTab] = await tabs.query({
        active: true,
        currentWindow: true,
      });

      if (firstActiveTab.url) {
        const url = new URL(firstActiveTab.url);
        const asin = url.pathname.split('/').filter(Boolean).pop();
        if (asin && ASIN_REGEX.test(asin)) {
          const audibleBook = await getAudibleBookInfo(asin);
          setBook(audibleBook);
        }
      }
      setIsLoading(false);
    };

    intialize();
  }, []);

  const getContent = () => {
    if (isLoading) {
      return <Spinner />;
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
