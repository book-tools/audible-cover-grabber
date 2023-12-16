import type { BoxProps } from '@chakra-ui/react';
import { Box, Image } from '@chakra-ui/react';
import prettyBytes from 'pretty-bytes';
import type { ReactEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import getRemoteFileSize from 'utils/get-remote-file-size';

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
  coverUrl: string | undefined;
}

const Cover = ({ coverUrl }: CoverProps) => {
  const [resolution, setResolution] = useState<Resolution | null>(null);

  const [imageBytes, setImageBytes] = useState<number | null>(null);
  const hasInitializedImageBytes = useRef(false);
  useEffect(() => {
    if (!hasInitializedImageBytes.current && coverUrl) {
      hasInitializedImageBytes.current = true;
      getRemoteFileSize(coverUrl).then(setImageBytes);
    }
  }, [coverUrl]);

  const handleImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { currentTarget } = e;
    setResolution({
      height: currentTarget.naturalHeight,
      width: currentTarget.naturalWidth,
    });
  };

  return (
    <Box position="relative" shadow="lg" rounded="lg" overflow="hidden">
      {!!imageBytes && (
        <FloatingInfo
          top={0}
          left={0}
          borderBottomRightRadius="lg"
          borderBottomWidth={1}
          borderRightWidth={1}
        >
          {prettyBytes(imageBytes)}
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
      <Image src={coverUrl} alt="" onLoad={handleImageLoad} />
    </Box>
  );
};

export default Cover;
