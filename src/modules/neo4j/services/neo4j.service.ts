import { Injectable, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';
import { config } from 'dotenv';

config()
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

@Injectable()
export class Neo4jService implements OnModuleDestroy {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
  }

  private getSession(): Session {
    return this.driver.session();
  }

  async read(query: string, params: Record<string, any> = {}) {
    const session = this.getSession();
    try {
      return await session.readTransaction(tx => tx.run(query, params));
    } finally {
      await session.close();
    }
  }

  async write(query: string, params: Record<string, any> = {}) {
    const session = this.getSession();
    try {
      return await session.writeTransaction(tx => tx.run(query, params));
    } finally {
      await session.close();
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
  }
}
