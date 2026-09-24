import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './response.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingInterceptor } from './logger/logging.interceptor';
declare const module: {
  hot?: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable trust proxy to get real client IP address
  app.set('trust proxy', true);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.error('Erro de validação DTO:', errors);
        return new BadRequestException(errors);
      },
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:3001', // for local development
      'http://localhost:3000', // for local development
      'https://agendeaqui-ui.onrender.com',
      'https://agendaqui-ui-admin.onrender.com',
      'https://www.agendaquisaude.com.br'// for production
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Agende Aqui - API')
    .setDescription('API do Sistema Agende Aqui')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  let port = parseInt(process.env.PORT || '3001', 10);
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await app.listen(port);
      console.log(`Application running on port ${port}`);
      break;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
        port++;
        retries++;
      } else {
        throw error;
      }
    }
  }

  if (retries >= maxRetries) {
    console.error(`Could not find an available port after ${maxRetries} attempts.`);
    process.exit(1);
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
    });
  }
}
bootstrap();
