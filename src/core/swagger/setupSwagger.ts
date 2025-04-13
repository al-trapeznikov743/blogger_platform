import {Express} from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export const setupSwagger = (app: Express) => {
  const docPath = path.resolve(__dirname, './swagger.yaml');
  const swaggerDocument = yaml.load(fs.readFileSync(docPath, 'utf8')) as Record<
    string,
    any
  >;

  app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
