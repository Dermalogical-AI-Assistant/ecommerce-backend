import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from 'src/database';
import * as useCases from './application';
import * as services from './services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Neo4jModule } from '../neo4j';

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter((x) => x.name.endsWith('Handler'));

const Services = [...Object.values(services)];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    HttpModule.register({
      timeout: 2147483647,
      maxRedirects: 5,
    }),
    JwtModule.register({ signOptions: { algorithm: 'HS256' } }),
    ConfigModule.forRoot(),
    Neo4jModule
  ],
  controllers: [...endpoints],
  providers: [...handlers, ...Services],
  exports: [...handlers, ...Services],
})
export class ProductModule {}
