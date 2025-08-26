export const config: {
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  PORT: string | number;
  MONGO_URL: string;
  DB_NAME: string;
  AC_SECRET: string;
  AC_TIME: string | number;
  RT_SECRET: string;
  RT_TIME: string | number;
  EMAIL: string;
  EMAIL_PASS: string;
  RATE_LIMIT: number;
  RATE_LIMIT_SEC: number;
} = {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'ADMIN_USERNAME',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ADMIN_PASSWORD',

  PORT: process.env.PORT || 5002,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  DB_NAME: process.env.DB_NAME || 'bloger-platform',

  AC_SECRET: process.env.AC_SECRET || 'ghfsd@q23dwdidwecee2',
  AC_TIME: process.env.AC_TIME || '10s',

  RT_SECRET: process.env.RT_SECRET || 'ghfsd@q23dwdidwecee3',
  RT_TIME: process.env.RT_TIME || '20s',

  EMAIL: process.env.EMAIL || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',

  get RATE_LIMIT(): number {
    return Number(process.env.RATE_LIMIT || '5');
  },

  get RATE_LIMIT_SEC(): number {
    return Number(process.env.RATE_LIMIT_SEC || '10');
  }
};
