export const config: {
  PORT: string | number;
  MONGO_URL: string;
  DB_NAME: string;
  AC_SECRET: string;
  AC_TIME: string | number;
  EMAIL: string;
  EMAIL_PASS: string;
} = {
  PORT: process.env.PORT || 5002,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  DB_NAME: process.env.DB_NAME || 'bloger-platform',
  AC_SECRET: process.env.AC_SECRET || 'ghfsd@q23dwdidwecee2',
  AC_TIME: process.env.AC_TIME || '10s',

  // EMAIL: process.env.EMAIL || 'your-email@gmail.com',
  // EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password'

  EMAIL: process.env.EMAIL || 'a.a.trapeznikov@yandex.ru',
  EMAIL_PASS: process.env.EMAIL_PASS || 'jhrzkbotcthmifev'

  // EMAIL: process.env.EMAIL || 'al.trapeznikov.744@gmail.com',
  // EMAIL_PASS: process.env.EMAIL_PASS || 'brsm vhqd ckwh lxpu'
};
