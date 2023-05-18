import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import { secure } from './common/middleware/secure.middleware';
import { InvalidAsinExceptionFilter } from './common/filters/invalid-asin-exception.filter';
// import secure from 'ssl-express-www';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(secure);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.useStaticAssets(join(__dirname, '../..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      partialsDir: join(__dirname, '..', 'views/partials'),
      defaultLayout: 'layout',
      layoutsDir: join(__dirname, '..', 'views/layouts'),
    })
  );
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3030);
}
bootstrap();
