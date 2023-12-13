export const onRequest = async (
  msg: EXTMessage,
): Promise<EXTResponse | undefined> => {
  console.log('~~~~~~~', msg);
  switch (msg.type) {
    case 'CHANGE_COLOR': {
      document.body.style.background = msg.data?.color;
      return { type: 'SUCCESS' };
    }
    default:
      return { type: 'SUCCESS' };
  }
};

export default onRequest;
