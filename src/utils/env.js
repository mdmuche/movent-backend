export const getEnvNumber = (key, fallback) => {
  const value = Number.parseInt(process.env[key], 10);

  return Number.isNaN(value) ? fallback : value;
};
