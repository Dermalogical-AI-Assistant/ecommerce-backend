import { Module } from '@nestjs/common';
import { Neo4jService } from './services';

@Module({
  providers: [Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {}
