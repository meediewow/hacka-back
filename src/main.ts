import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';

import {
  getEnvSafe,
  getSafeEnvVariables,
  isProduction,
  printVariables
} from './env';
import { AppModule } from './modules/app/app.module';
import { initSwagger } from './swagger';

const printDevEnv = () => {
  if (isProduction()) {
    return;
  }

  const variables = getSafeEnvVariables();

  console.log('--------------------\n');
  printVariables(variables);
  console.log('\n');
  console.log('--------------------\n');
};

async function bootstrap() {
  // TODO: отключить в финальной версии для прода
  printDevEnv();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  initSwagger(app);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  const port = getEnvSafe('PORT');
  await app.listen(port);
}

void bootstrap();
