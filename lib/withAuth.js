import { parseUserFromServerContext } from './utility';

export default async (
  context,
  handler,
  roles = ['admin', 'guru', 'peserta'],
) => {
  const user = parseUserFromServerContext(context);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
      },
    };
  }

  if (!roles.includes(user.role)) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return await handler(user);
};
