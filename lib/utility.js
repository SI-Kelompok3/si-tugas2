export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
export const sqlToObject = (a) => JSON.parse(JSON.stringify(a));
