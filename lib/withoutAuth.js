import { parseUserFromServerContext } from './utility';

export default async (context, handler) => {
  const user = parseUserFromServerContext(context);

  if (user) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return handler();
};
