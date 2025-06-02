import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/database';
import { CreateImportSocketClientCommand } from './createImportSocketClient.command';

@CommandHandler(CreateImportSocketClientCommand)
export class CreateImportSocketClientHandler
    implements ICommandHandler<CreateImportSocketClientCommand> {
    constructor(private readonly dbContext: PrismaService) { }

    public async execute({ body: { importFileId, clientId } }: CreateImportSocketClientCommand): Promise<any> {
        await this.dbContext.importSocketClient.create({
            data: {
                clientId,
                fileId: importFileId
            }
        })
    }
}
