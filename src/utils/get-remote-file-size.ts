const getRemoteFileSize = async (fileUrl: string): Promise<number | null> => {
  const response = await fetch(fileUrl, {
    method: 'HEAD',
  });
  const size = response.headers.get('content-length');
  return size ? parseInt(size, 10) : null;
};

export default getRemoteFileSize;
