import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {config} from './core/settings/config';
import {setupApp} from './setupApp';
import {runDB} from './db/mongo.db';

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  const PORT = config.PORT;

  await runDB(config.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  return app;
};

bootstrap();
