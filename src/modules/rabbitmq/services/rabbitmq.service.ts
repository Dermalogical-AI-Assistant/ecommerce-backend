import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Options } from 'amqplib';
import { config } from 'dotenv';

config()
const uri = process.env.RABBITMQ_URL;

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RabbitMqService.name);
    private connection: AmqpConnectionManager;
    private channel: ChannelWrapper;

    async onModuleInit() {
        this.logger.log('Connecting to RabbitMQ...');
        this.connection = connect([uri]);

        this.channel = this.connection.createChannel({
            json: true,
            setup: async (channel) => {
                this.logger.log('RabbitMQ channel is ready.');
                this.logger.log(`Channel: ${channel}.`);

            },
        });

        this.connection.on('connect', () => {
            this.logger.log('RabbitMQ connected.');
        });

        this.connection.on('disconnect', (err) => {
            this.logger.error('RabbitMQ disconnected:', err);
        });
    }

    async publish(queue: string, data: any) {
        const success = await this.channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(data))
        );

        if (!success) {
            this.logger.warn(`Failed to write to queue "${queue}"`);
        } else {
            this.logger.log(`Message published to queue "${queue}"`);
        }
    }

    async onModuleDestroy() {
        await this.channel?.close();
        await this.connection?.close();
        this.logger.log('RabbitMQ connection closed.');
    }
}
