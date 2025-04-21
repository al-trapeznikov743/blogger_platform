export const config = {
  PORT: process.env.PORT || 5002,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  DB_NAME: process.env.DB_NAME || 'bloger-platform'
};
