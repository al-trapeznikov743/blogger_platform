import express from 'express';
import {setupApp} from './setupApp';

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});