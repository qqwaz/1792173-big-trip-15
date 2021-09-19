export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getRandomString = () => Math.random().toString(20).substr(2);

export const isOnline = () => window.navigator.onLine;
