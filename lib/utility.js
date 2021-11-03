export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
export const sqlToObject = (a) => JSON.parse(JSON.stringify(a));
export const parseUserFromServerContext = (context) => {
  try {
    const { username, role, nama, id } = JSON.parse(context.req.cookies.user);

    return {
      username,
      role,
      nama,
      id,
    };
  } catch (e) {
    return null;
  }
};
