import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as useCases from './application';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from '../product';
import * as services from './services';

const applications = Object.values(useCases);
const endpoints = applications.filter((x) => x.name.endsWith('Endpoint'));
const handlers = applications.filter((x) => x.name.endsWith('Handler'));
const Services = [...Object.values(services)];

@Module({
  imports: [
    CqrsModule, 
    DatabaseModule, 
    ConfigModule.forRoot(),
    ProductModule,
    JwtModule.register({signOptions: {algorithm: 'HS256'}}),
  ],
  controllers: [...endpoints],
  providers: [...handlers, ...Services],
  exports: [...handlers, ...Services],
})
export class DiscountModule {}
