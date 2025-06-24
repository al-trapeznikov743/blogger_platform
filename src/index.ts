import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {config} from './core/settings/config';
import {setupApp} from './setupApp';
import {db} from './db/mongo.db';

const startApp = async () => {
  const app = express();
  setupApp(app);

  await db.run(config.MONGO_URL);

  const PORT = config.PORT;

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  return app;
};

startApp();
