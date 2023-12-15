import { Box, Image } from '@chakra-ui/react';
import type { ReactEventHandler } from 'react';
import React, { useState } from 'react';
import type { AudibleBook } from 'utils/audible/types';

interface Resolution {
  height: number;
  width: number;
}

interface CoverProps {
  book: AudibleBook;
}

const Cover = ({ book }: CoverProps) => {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  const handleImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { currentTarget } = e;
    setResolution({
      height: currentTarget.naturalHeight,
      width: currentTarget.naturalWidth,
    });
  };

  return (
    <Box position="relative" shadow="md" rounded="lg" overflow="hidden">
      {!!resolution && (
        <Box
          position="absolute"
          top={0}
          right={0}
          py={2}
          px={3}
          fontWeight="bold"
          bg="gray.800"
          color="white"
          borderBottomLeftRadius="lg"
          borderColor="gray.600"
          borderBottomWidth={1}
          borderLeftWidth={1}
        >
          {resolution.width} x {resolution.height}
        </Box>
      )}
      <Image
        src={book.largeCoverUrl}
        alt={`${book.title} Cover`}
        onLoad={handleImageLoad}
      />
    </Box>
  );
};

export default Cover;
