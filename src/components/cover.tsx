import type { BoxProps } from '@chakra-ui/react';
import { Box, Image } from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import type { ReactEventHandler } from 'react';
import React, { useState } from 'react';
import type { AudibleBook } from 'utils/audible/types';

const FloatingInfo = ({ children, ...props }: BoxProps) => (
  <Box
    position="absolute"
    py={2}
    px={3}
    fontWeight="bold"
    bg="gray.800"
    color="white"
    borderColor="gray.600"
    {...props}
  >
    {children}
  </Box>
);

interface Resolution {
  height: number;
  width: number;
}

interface CoverProps {
  book: AudibleBook;
  fileSize: number | null;
}

const Cover = ({ book, fileSize }: CoverProps) => {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  const handleImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { currentTarget } = e;
    setResolution({
      height: currentTarget.naturalHeight,
      width: currentTarget.naturalWidth,
    });
  };

  return (
    <Box position="relative" shadow="lg" rounded="lg" overflow="hidden">
      {!!fileSize && (
        <FloatingInfo
          top={0}
          left={0}
          borderBottomRightRadius="lg"
          borderBottomWidth={1}
          borderRightWidth={1}
        >
          {prettyBytes(fileSize)}
        </FloatingInfo>
      )}
      {!!resolution && (
        <FloatingInfo
          top={0}
          right={0}
          borderBottomLeftRadius="lg"
          borderBottomWidth={1}
          borderLeftWidth={1}
        >
          {resolution.width} x {resolution.height}
        </FloatingInfo>
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
