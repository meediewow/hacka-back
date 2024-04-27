import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { swaggerConfig } from './config';

export const initSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
};
